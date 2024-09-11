import { Rawmaterial } from "../../rawmaterial/entities/rawmaterial.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'suppliers'})
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column('text',{
    default: 'independiente'
  })
  personeria:string;
  
  @Column('text')
  namecontact:string;

  @Column('bigint',{
    default: 0,
    unique: true
  })
  tel:number;

  @Column('bigint', {
    default: 0,
    unique: true
  })
  dpi:number;

  @Column('text')
  address:string;

  @Column('boolean',{
    default: false
  })
  deleted: boolean;

  @OneToMany(
    () => Rawmaterial,
    (rawmaterial) => rawmaterial.supplierId,
    { cascade: true }
  )
  rawmaterial: Rawmaterial;
}
