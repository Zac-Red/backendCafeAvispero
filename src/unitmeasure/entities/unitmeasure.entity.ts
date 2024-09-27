import { Inventoryrawmaterial } from "src/inventoryrawmaterial/entities/inventoryrawmaterial.entity";
import { Product } from "src/products/entities/product.entity";
import { Rawmaterial } from "src/rawmaterial/entities/rawmaterial.entity";
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
    () => Inventoryrawmaterial,
    (inventoryrawmaterial) => inventoryrawmaterial.unitmeasureId,
  )
  inventoryrawmaterial: Inventoryrawmaterial;
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
