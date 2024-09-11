import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export class ShoppingDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'int' })
  quantity: number;
/*
  @ManyToOne(() => RawMaterial)
  rawMaterial: RawMaterial;

  @ManyToOne(() => Purchases)
  purchase: Purchases;
*/
}
