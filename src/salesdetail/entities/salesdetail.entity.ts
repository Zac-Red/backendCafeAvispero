import { Product } from "src/products/entities/product.entity";
import { Sale } from "src/sales/entities/sale.entity";
import { Unitmeasure } from "src/unitmeasure/entities/unitmeasure.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'salesdetail' })
export class Salesdetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'float' })
  subtotal: number;

  @ManyToOne(
    () => Unitmeasure,
    (unitmeasure) => unitmeasure.saledetail,
    { eager: true }
  )
  unitmeasureId: Unitmeasure;

  @ManyToOne(
    () => Product,
    (product) => product.saledetail,
    { eager: true }
  )
  productId: Product;

  @ManyToOne(
    () => Sale,
    (sale) => sale.salesdetail,
    { eager: true }
  )
  saleId: Sale;
}
