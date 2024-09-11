import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
}
