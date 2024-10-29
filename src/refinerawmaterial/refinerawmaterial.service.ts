import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRefinerawmaterialDto } from './dto/create-refinerawmaterial.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Refinerawmaterial } from './entities/refinerawmaterial.entity';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { RawmaterialService } from 'src/rawmaterial/rawmaterial.service';
import { QueryParamsRefineRawMaterialDto } from './dto/query-params-refinerawmaterial.dto';
import { getAllPaginated } from 'src/common/helpers/find.helpers';
import { Conversionrawmaterial } from './entities/conversionrawmaterial.entity';
import { CreateconversionrawmaterialDto } from './dto/create-conversiorawmaterial.dto';
import { UnitmeasureService } from 'src/unitmeasure/unitmeasure.service';
import { InventoryrawmaterialService } from 'src/inventoryrawmaterial/inventoryrawmaterial.service';

@Injectable()
export class RefinerawmaterialService {
  constructor(
    @InjectRepository(Refinerawmaterial)
    private readonly refinerawmaterialRepository: Repository<Refinerawmaterial>,
    @InjectRepository(Conversionrawmaterial)
    private readonly conversionrawmaterialRepository: Repository<Conversionrawmaterial>,
    private readonly rawmaterialservice: RawmaterialService,
    private readonly unitmeasureservice: UnitmeasureService,
    private readonly inventoryrawmaterialservice: InventoryrawmaterialService,
    private readonly DBErrors: HandleDBErrors,
    private readonly uuidAdapter: UuidAdapter,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) { }

  async create(createRefinerawmaterialDto: CreateRefinerawmaterialDto) {
    const { amount, rawmaterialId, unitmeasureId } = createRefinerawmaterialDto
    let refinerawmaterialcomplet;
    await this.dataSource.transaction(async (manager) => {
      const rawmaterial = await this.rawmaterialservice.findOne(rawmaterialId)
      const unitmeasure = await this.unitmeasureservice.findOne(String(unitmeasureId))
      try {
        const refinematerial = manager.create(Refinerawmaterial, { amount, rawmaterialId: rawmaterial, unitmeasureId: unitmeasure });
        refinerawmaterialcomplet = await manager.save(refinematerial);
      } catch (error) {
        this.DBErrors.exceptionsDB(error);
      }
      let rawstockconversion = rawmaterial.stock * rawmaterial.unitmeasureId.conversionfactor;
      let quantityconversion = amount * unitmeasure.conversionfactor;
      
      let rawmastock = rawstockconversion + quantityconversion;
      let rawrealstock = rawmastock / rawmaterial.unitmeasureId.conversionfactor;
      await this.rawmaterialservice.update(rawmaterial.id, {
        stock: rawrealstock,
        supplierId: rawmaterial.supplierId.id,
        unitmeasureId: rawmaterial.unitmeasureId.id
      },
        manager
      );
      await this.inventoryrawmaterialservice.inventoryAdjustment({
        amount, 
        inventorymoveId: 2, 
        rawmaterialId:  rawmaterial.id,
        unitmeasureId: unitmeasure.id
      }, manager)
    });
    return {
      refinerawmaterialcomplet
    };
  }

  async findAll(queryparamsrefinerawmaterialDto: QueryParamsRefineRawMaterialDto) {
    const { rawmaterial, limit = 10, page = 1 } = queryparamsrefinerawmaterialDto;

    const qb = this.refinerawmaterialRepository.createQueryBuilder('refinerawmaterial')
      .leftJoinAndSelect("refinerawmaterial.rawmaterialId", "rawmaterial")
      .orderBy("refinerawmaterial.id", "ASC")
    if (rawmaterial) {
      qb.where(`LOWER(rawmaterial.name) LIKE :name`, { name: `%${rawmaterial.toLowerCase()}%` });
    }
    return await getAllPaginated(qb, { page, take: limit });
  }

  async findOne(term: string) {
    let refinerawmaterial: Refinerawmaterial;
    if (this.uuidAdapter.IsUUID(term)) {
      refinerawmaterial = await this.refinerawmaterialRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.refinerawmaterialRepository.createQueryBuilder('refinerawmaterial')
        .leftJoinAndSelect("refinerawmaterial.rawmaterialId", "rawmaterial")
      refinerawmaterial = await queryBuilder
        .where("LOWER(rawmaterial.name) = LOWER(:name)", { name: term }).getOne();
    }
    if (!refinerawmaterial) throw new BadRequestException(`El procesado de material prima ${term} no existe`);
    return refinerawmaterial;
  }

  async revertRefinement(refinementId: string) {
    await this.dataSource.transaction(async (manager) => {
      // 1. Obtener el refinamiento
      const refinement = await manager.findOne(Refinerawmaterial, { where: { id: refinementId } });
      if (!refinement) throw new NotFoundException(`Refinamiento con ID ${refinementId} no encontrado`);
  
      const { amount, rawmaterialId, unitmeasureId } = refinement;
      const rawmaterial = await this.rawmaterialservice.findOne(rawmaterialId.id);
  
      // 2. Calcular y revertir el stock de materia prima
      let rawstockconversion = rawmaterial.stock * rawmaterial.unitmeasureId.conversionfactor;
      let quantityconversion = amount * unitmeasureId.conversionfactor;
      
      let rawmastock = rawstockconversion - quantityconversion;
      let rawrealstock = rawmastock / rawmaterial.unitmeasureId.conversionfactor;
      
      await this.rawmaterialservice.update(rawmaterialId.id, {
        stock: rawrealstock,
        supplierId: rawmaterial.supplierId.id,
        unitmeasureId: rawmaterial.unitmeasureId.id
      }, manager);
  
      // 3. Registrar ajuste de inventario negativo
      await this.inventoryrawmaterialservice.inventoryAdjustment(
        { amount: amount, inventorymoveId: 1, rawmaterialId: rawmaterialId.id, unitmeasureId: unitmeasureId.id },
        manager
      );
  
      // 4. Eliminar el refinamiento
      await manager.delete(Refinerawmaterial, { id: refinementId });
    });
  }

  async convertRawMaterial(createconversionrawmaterialDto: CreateconversionrawmaterialDto) {
    const { amountToConvert, sourceMaterialId, targetMaterialId,
      unitMeasureSourceId, unitMeasureTargetId } = createconversionrawmaterialDto;
    const sourceMaterial = await this.rawmaterialservice.findOne(sourceMaterialId)
    const targetMaterial = await this.rawmaterialservice.findOne(targetMaterialId)
    const targetUnit = await this.unitmeasureservice.findOne(String(unitMeasureTargetId))
    const sourceUnit = await this.unitmeasureservice.findOne(String(unitMeasureSourceId))

    return this.dataSource.transaction(async (manager) => {
      // 3. Convertir la cantidad de la materia prima origen a la unidad base (gramos)
      const amountInBaseUnit = amountToConvert * sourceUnit.conversionfactor; // Factor de conversión a gramos

      // 4. Descontar del stock de la materia prima origen
      const amountToDeduct = amountInBaseUnit / sourceMaterial.unitmeasureId.conversionfactor; // Ajustar a la unidad del stock
      if (sourceMaterial.stock < amountToDeduct) {
        throw new BadRequestException('Stock insuficiente');
      }
      sourceMaterial.stock -= amountToDeduct;
      // 5. Convertir la cantidad procesada a la unidad destino
      const amountInTargetUnit = amountInBaseUnit / targetUnit.conversionfactor;

      // 6. Aumentar el stock de la materia prima destino
      const amountToAdd = amountInTargetUnit * targetMaterial.unitmeasureId.conversionfactor; // Ajustar a la unidad del stock
      targetMaterial.stock += amountToAdd;

      // 7. Guardar los cambios
      await manager.save(sourceMaterial);
      this.inventoryrawmaterialservice.inventoryAdjustment({
        amount: amountInBaseUnit,
        inventorymoveId: 1,
        rawmaterialId: sourceMaterial.id,
        unitmeasureId: sourceUnit.id
      }, manager)
      await manager.save(targetMaterial);
      this.inventoryrawmaterialservice.inventoryAdjustment({
        amount: amountInTargetUnit,
        inventorymoveId: 2,
        rawmaterialId: targetMaterial.id,
        unitmeasureId: targetUnit.id
      }, manager)

      // 8. Registrar la conversión
      const conversionRecord = manager.create(Conversionrawmaterial, {
        amount: amountToConvert,
        rawmaterialId: sourceMaterial,
        unitmeasureId: sourceUnit,
      });
      await manager.save(conversionRecord);

      return { sourceMaterial, targetMaterial };
    });
  }
}
