import { Customer } from "src/customers/entities/customer.entity";
import { Salesdetail } from "src/salesdetail/entities/salesdetail.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'sales'})
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column('float')
  total:number

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(
    () => Customer,
    (customer) => customer.sale,
    { eager: true }
  )
  customerId: Customer;

  @OneToMany(
    () => Salesdetail,
    (salesdetail) => salesdetail.saleId,
    { cascade: true }
  )
  salesdetail: Salesdetail;
}
