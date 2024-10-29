import { Rawmaterial } from "src/rawmaterial/entities/rawmaterial.entity";
import { Unitmeasure } from "src/unitmeasure/entities/unitmeasure.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'refinerawmaterial' })
export class Refinerawmaterial {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column('float', {default: 0})
  amount: number;

  @ManyToOne(
    () => Rawmaterial,
    (rawmaterial) => rawmaterial.refinerawmaterial,
    { eager: true }
  )
  rawmaterialId: Rawmaterial;

  @ManyToOne(
    () => Unitmeasure,
    (unitmeasure) => unitmeasure.refinerawmaterial,
    { eager: true }
  )
  unitmeasureId: Unitmeasure;

  @CreateDateColumn()
  createdAt: Date;
}
