import { ShoppingDetail } from "src/shoppingdetail/entities/shoppingdetail.entity";
import { Supplier } from "src/suppliers/entities/supplier.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'shoppings'})
export class Shopping {
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column('text')
  commercialdocument:string;

  @Column('float')
  total:number

  @Column('date')
  datecommercialdocument: Date;
  
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(
    () => Supplier,
    (supplier) => supplier.shopping,
    { eager: true }
  )
  supplierId: Supplier;

  @OneToMany(
    () => ShoppingDetail,
    (shoppingdetail) => shoppingdetail.shoppingId,
    { cascade: true }
  )
  shoppingdetail: ShoppingDetail;
}
