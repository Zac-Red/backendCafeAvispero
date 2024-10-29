import { Detailproduction } from "src/detailproduction/entities/detailproduction.entity";
import { Inventoryproduct } from "src/inventoryproduct/entities/inventoryproduct.entity";
import { Inventoryrawmaterial } from "src/inventoryrawmaterial/entities/inventoryrawmaterial.entity";
import { Product } from "src/products/entities/product.entity";
import { Rawmaterial } from "src/rawmaterial/entities/rawmaterial.entity";
import { Conversionrawmaterial } from "src/refinerawmaterial/entities/conversionrawmaterial.entity";
import { Refinerawmaterial } from "src/refinerawmaterial/entities/refinerawmaterial.entity";
import { Salesdetail } from "src/salesdetail/entities/salesdetail.entity";
import { ShoppingDetail } from "src/shoppingdetail/entities/shoppingdetail.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'unitmeasure' })
export class Unitmeasure {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('float',{
    default: 0
  })
  conversionfactor: number;

  @Column('boolean', {
    default: false
  })
  deleted: boolean;

  @OneToMany(
    () => Product,
    (product) => product.unitmeasureId,
  )
  product: Product;

  @OneToMany(
    () => Rawmaterial,
    (rawmaterial) => rawmaterial.unitmeasureId,
  )
  rawmaterial: Rawmaterial;

  @OneToMany(
    () => ShoppingDetail,
    (shoppingdetail) => shoppingdetail.unitmeasureId,
  )
  shoppingdetail: ShoppingDetail;

  @OneToMany(
    () => Salesdetail,
    (saledetail) => saledetail.unitmeasureId,
  )
  saledetail: Salesdetail;

  @OneToMany(
    () => Inventoryrawmaterial,
    (inventoryrawmaterial) => inventoryrawmaterial.unitmeasureId,
  )
  inventoryrawmaterial: Inventoryrawmaterial;
  
  @OneToMany(
    () => Inventoryproduct,
    (inventoryproduct) => inventoryproduct.unitmeasureId,
  )
  inventoryproduct: Inventoryproduct;

  @OneToMany(
    () => Detailproduction,
    (detailproduction) => detailproduction.unitmeasureId,
  )
  detailproduction: Detailproduction;

  @OneToMany(
    () => Conversionrawmaterial,
    (conversionrawmaterial) => conversionrawmaterial.unitmeasureId,
  )
  conversionrawmaterial: Conversionrawmaterial;

  @OneToMany(
    () => Refinerawmaterial,
    (refinerawmaterial) => refinerawmaterial.unitmeasureId,
  )
  refinerawmaterial: Refinerawmaterial;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
