import { Rawmaterial } from "src/rawmaterial/entities/rawmaterial.entity";
import { Unitmeasure } from "src/unitmeasure/entities/unitmeasure.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'conversionrawmaterial' })
export class Conversionrawmaterial {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column('float', {default: 0})
  amount: number;

  @ManyToOne(
    () => Rawmaterial,
    (rawmaterial) => rawmaterial.conversionrawmaterial,
    { eager: true }
  )
  rawmaterialId: Rawmaterial;

  @ManyToOne(
    () => Unitmeasure,
    (unitmeasure) => unitmeasure.conversionrawmaterial,
    { eager: true }
  )
  unitmeasureId: Unitmeasure;

  @CreateDateColumn()
  createdAt: Date;
}