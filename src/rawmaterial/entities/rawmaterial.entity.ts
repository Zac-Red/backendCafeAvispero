import { Detailproduction } from "src/detailproduction/entities/detailproduction.entity";
import { Inventoryrawmaterial } from "src/inventoryrawmaterial/entities/inventoryrawmaterial.entity";
import { Conversionrawmaterial } from "src/refinerawmaterial/entities/conversionrawmaterial.entity";
import { Refinerawmaterial } from "src/refinerawmaterial/entities/refinerawmaterial.entity";
import { ShoppingDetail } from "src/shoppingdetail/entities/shoppingdetail.entity";
import { Supplier } from "src/suppliers/entities/supplier.entity";
import { Unitmeasure } from "src/unitmeasure/entities/unitmeasure.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'rawmaterials' })
export class Rawmaterial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('text', {
    nullable: true
  })
  url: string;

  @Column('float',{
    default: 0
  })
  price: number;

  @Column('float', {
    default: 0
  })
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('boolean', {
    default: false
  })
  deleted: boolean;
  
  @ManyToOne(
    () => Supplier,
    (supplier) => supplier.rawmaterial,
    { eager: true }
  )
  supplierId: Supplier;

  @ManyToOne(
    () => Unitmeasure,
    (unitmeasure) => unitmeasure.rawmaterial,
    { eager: true }
  )
  unitmeasureId: Unitmeasure;

  @OneToMany(
    () => Inventoryrawmaterial,
    (inventoryrawmaterial) => inventoryrawmaterial.rawmaterialId,
  )
  rawmaterialinventory: Inventoryrawmaterial;

  @OneToMany(
    () => ShoppingDetail,
    (shoppingdetail) => shoppingdetail.rawmaterialId,
  )
  shoppingdetail: ShoppingDetail;

  @OneToMany(
    () => Detailproduction,
    (detailproduction) => detailproduction.rawmaterialId,
  )
  detailproduction: Detailproduction;

  @OneToMany(
    () => Refinerawmaterial,
    (refinerawmaterial) => refinerawmaterial.rawmaterialId,
  )
  refinerawmaterial: Refinerawmaterial;

  @OneToMany(
    () => Conversionrawmaterial,
    (conversionrawmaterial) => conversionrawmaterial.rawmaterialId,
  )
  conversionrawmaterial: Conversionrawmaterial;
}
