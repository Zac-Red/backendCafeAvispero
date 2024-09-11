import { Unitmeasure } from "src/unitmeasure/entities/unitmeasure.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('float',{
    default: 0
  })
  price: number;

  @Column('int',{
    default: 0
  })
  stock: number;

  @ManyToOne(
    () => Unitmeasure,
    (unitmeasure) => unitmeasure.product,
    { eager: true }
  )
  unitmeasureId: Unitmeasure;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('bool', {
    default: false
  })
  deleted: boolean;
}
