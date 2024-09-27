import { Shopping } from "src/shopping/entities/shopping.entity";
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

  @Column('int',{
    default: 0,
  })
  tel:number;

  @Column('int', {
    unique: true
  })
  dpi:number;

  @Column('text', {
    default: "Sin dirección",
  })
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

  @OneToMany(
    () => Shopping,
    (shopping) => shopping.supplierId,
    { cascade: true }
  )
  shopping: Shopping;
}
