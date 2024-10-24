import { Detailproduction } from "src/detailproduction/entities/detailproduction.entity";
import { Production } from "src/productions/entities/production.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'recipproduction' })
export class Recipproduction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'float' })
  amount: number;

  @ManyToOne(
    () => Product,
    (product) => product.recipproduction,
    { eager: true }
  )
  productId: Product;
  
  @OneToMany(
    () => Detailproduction,
    (detailproduction) => detailproduction.recipproductionId,
  )
  detailproduction: Detailproduction;

  @OneToMany(
    () => Production,
    (production) => production.recipproductionId,
  )
  production: Production;

  @CreateDateColumn()
  createdAt: Date;
}
