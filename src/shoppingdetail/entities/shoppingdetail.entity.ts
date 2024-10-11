import { Rawmaterial } from "src/rawmaterial/entities/rawmaterial.entity";
import { Shopping } from "src/shopping/entities/shopping.entity";
import { Unitmeasure } from "src/unitmeasure/entities/unitmeasure.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'shoppingdetail' })
export class ShoppingDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'float' })
  subtotal: number;

  @ManyToOne(
    () => Unitmeasure,
    (unitmeasure) => unitmeasure.shoppingdetail,
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
    () => Shopping,
    (shopping) => shopping.shoppingdetail,
    { eager: true }
  )
  shoppingId: Shopping;
}
