import { Product } from "src/products/entities/product.entity";
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
