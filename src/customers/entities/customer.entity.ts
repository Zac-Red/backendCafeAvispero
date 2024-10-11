import { Sale } from "src/sales/entities/sale.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'customers'})
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column('text')
  name:string;

  @Column('int')
  phone:number;

  @Column('text')
  nit:string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('boolean', {
    default: false
  })
  deleted: boolean;

  @OneToMany(
    () => Sale,
    (sale) => sale.customerId,
    { cascade: true }
  )
  sale: Sale;
}
