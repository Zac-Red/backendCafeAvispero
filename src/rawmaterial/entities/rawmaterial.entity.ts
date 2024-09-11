import { Supplier } from "src/suppliers/entities/supplier.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
// import { RawMaterialImage } from './rawmaterial-images.entity'

@Entity({ name: 'rawmaterials' })
export class Rawmaterial {
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

  @Column('int', {
    default: 0
  })
  stock: number;

  @Column('text')
  unitMeasure: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('boolean', {
    default: false
  })
  deleted: boolean;
  
  @ManyToOne(
    () => Supplier,
    (supplier) => supplier.rawmaterial,
    { eager: true }
  )
  supplierId: Supplier;

  // @OneToMany(
  //   () => RawMaterialImage,
  //   (rawmaterialimage) => rawmaterialimage.rawmaterial,
  //   { cascade: true, eager: true }
  // )
  // images?: RawMaterialImage;
}
