import { Inventoryrawmaterial } from "src/inventoryrawmaterial/entities/inventoryrawmaterial.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'inventorymoves' })
export class Inventorymove {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('boolean', {
    default: false
  })
  deleted: boolean;

  @OneToMany(
    () => Inventoryrawmaterial,
    (inventoryrawmaterial) => inventoryrawmaterial.inventorymoveId,
  )
  inventoryrawmaterial: Inventoryrawmaterial;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}