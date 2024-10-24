import { Rawmaterial } from "src/rawmaterial/entities/rawmaterial.entity";
import { Recipproduction } from "src/recipproduction/entities/recipproduction.entity";
import { Unitmeasure } from "src/unitmeasure/entities/unitmeasure.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'detailproduction' })
export class Detailproduction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  amount: number;
  
  @ManyToOne(
    () => Unitmeasure,
    (unitmeasure) => unitmeasure.detailproduction,
    { eager: true }
  )
  unitmeasureId: Unitmeasure;

  @ManyToOne(
    () => Rawmaterial,
    (rawmaterial) => rawmaterial.shoppingdetail,
    { eager: true }
  )
  rawmaterialId: Rawmaterial;

  @ManyToOne(
    () => Recipproduction,
    (recipproduction) => recipproduction.detailproduction,
    { eager: true }
  )
  recipproductionId: Recipproduction;
}
