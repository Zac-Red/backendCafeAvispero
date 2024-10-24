import { Inventorymove } from "src/inventorymoves/entities/inventorymove.entity";
import { Rawmaterial } from "src/rawmaterial/entities/rawmaterial.entity";
import { Unitmeasure } from "src/unitmeasure/entities/unitmeasure.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'inventoryrawmaterial' })
export class Inventoryrawmaterial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float',{
    default: 0
  })
  amount: number;
  
  @ManyToOne(
    () => Rawmaterial,
    (rawmaterial) => rawmaterial.rawmaterialinventory,
    { eager: true }
  )
  rawmaterialId: Rawmaterial;

  @ManyToOne(
    () => Unitmeasure,
    (unitmeasure) => unitmeasure.inventoryrawmaterial,
    { eager: true }
  )
  unitmeasureId: Unitmeasure;

  @ManyToOne(
    () => Inventorymove,
    (inventorymove) => inventorymove.inventoryrawmaterial,
    { eager: true }
  )
  inventorymoveId: Inventorymove;

  @CreateDateColumn()
  createdAt: Date;
}

