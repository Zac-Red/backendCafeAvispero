import { Inventorymove } from "src/inventorymoves/entities/inventorymove.entity";
import { Product } from "src/products/entities/product.entity";
import { Unitmeasure } from "src/unitmeasure/entities/unitmeasure.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'inventoryproduct' })
export class Inventoryproduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float',{
    default: 0
  })
  amount: number;

  @ManyToOne(
    () => Product,
    (product) => product.productinventory,
    { eager: true }
  )
  productId: Product;

  @ManyToOne(
    () => Unitmeasure,
    (unitmeasure) => unitmeasure.inventoryproduct,
    { eager: true }
  )
  unitmeasureId: Unitmeasure;

  @ManyToOne(
    () => Inventorymove,
    (inventorymove) => inventorymove.inventoryproduct,
    { eager: true }
  )
  inventorymoveId: Inventorymove;

  @CreateDateColumn()
  createdAt: Date;
}
