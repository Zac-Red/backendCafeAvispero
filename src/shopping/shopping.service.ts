import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateShoppingDto } from './dto/create-shopping.dto';
import { UpdateShoppingDto } from './dto/update-shopping.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Shopping } from './entities/shopping.entity';
import { DataSource, Repository } from 'typeorm';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { RawmaterialService } from 'src/rawmaterial/rawmaterial.service';
import { ShoppingdetailService } from 'src/shoppingdetail/shoppingdetail.service';
import { InventoryrawmaterialService } from 'src/inventoryrawmaterial/inventoryrawmaterial.service';

@Injectable()
export class ShoppingService {
  constructor(
    @InjectRepository(Shopping)
    private readonly shoppingRepository: Repository<Shopping>,
    private readonly supplierservices: SuppliersService,
    private readonly rawmaterialservices: RawmaterialService,
    private readonly shoppingdetailservice: ShoppingdetailService,
    private readonly inventoryrawmaterialservice: InventoryrawmaterialService,
    @InjectDataSource() 
    private readonly dataSource: DataSource,
    private readonly DBErrors: HandleDBErrors,
    private readonly uuidAdapter: UuidAdapter, 
  ){}

  
  async create(createShoppingDto: CreateShoppingDto) {
    const { shoppingdetail, supplierId, ...restDataShopping } = createShoppingDto;
    let shoppingComplet;
    await this.dataSource.transaction(async (manager) => {
      try {
        const supplier = await this.supplierservices.findOne(supplierId);        
        const shopping = manager.create(Shopping, {...restDataShopping, supplierId: supplier});
        shoppingComplet = await manager.save(shopping);
      } catch (error) {
        this.DBErrors.exceptionsDB(error);
      }

      for (const detail of shoppingdetail) {
        const { rawmaterialId, amount, price, subtotal } = detail;
        const rawmaterial = await this.rawmaterialservices.findOne(rawmaterialId);

        await this.shoppingdetailservice.create(
          { rawmaterialId, amount, price, subtotal, unitmeasureId: rawmaterial.unitmeasureId.id, shoppingId: shoppingComplet.id }, 
          manager 
        );
        
        const { stock,...restDatarawmaterial} = rawmaterial;
        await this.rawmaterialservices.update(
          restDatarawmaterial.id, 
          { ...restDatarawmaterial, 
            supplierId: restDatarawmaterial.supplierId.id, 
            unitmeasureId: String(restDatarawmaterial.unitmeasureId.id), 
            stock: stock + amount }, 
          manager
        );

        await this.inventoryrawmaterialservice.inventoryAdjustment(
          { amount, inventorymoveId: 2, rawmaterialId, unitmeasureId: rawmaterial.unitmeasureId.id }, 
          manager
        );
      }
    });
    // try {
    //   const supplier = await this.supplierservices.findOne(supplierId);
    //   const shopping = await this.shoppingRepository.create({...restDataShopping, supplierId: supplier});
    //   const shoppingComplet = await this.shoppingRepository.save(shopping);
    //   for (const detail of shoppingdetail) {
    //     const { rawmaterialId, amount, ...restDetail } = detail;
    //     const rawmaterial = await this.rawmaterialservices.findOne(rawmaterialId);
    //     await this.shoppingdetailservice.create({rawmaterialId, amount, ...restDetail, unitmeasureId: rawmaterial.unitmeasureId.id , shoppingId: shoppingComplet.id});
    //     await this.rawmaterialservices.update(rawmaterialId, { stock: rawmaterial.stock + amount });
    //     await this.inventoryrawmaterialservice.inventoryAdjustment({ amount, inventorymoveId: 2, rawmaterialId, unitmeasureId: rawmaterial.unitmeasureId.id});
    //   }
    // } catch (error) {
    //   this.DBErrors.exceptionsDB(error);
    // }
    return{
      shoppingComplet
    }
  }

  findAll() {
    return `This action returns all shopping`;
  }

  async findOne(term: string) {
    let shopping: Shopping;
    if(this.uuidAdapter.IsUUID(term)){
      shopping = await this.shoppingRepository.findOneBy({ id: term });
    }
    if (!shopping) throw new BadRequestException(`La compra con id ${term} no existe`);
    return shopping;
  }

  update(id: number, updateShoppingDto: UpdateShoppingDto) {
    return `This action updates a #${id} shopping`;
  }
}
