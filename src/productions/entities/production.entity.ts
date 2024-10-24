import { Recipproduction } from "src/recipproduction/entities/recipproduction.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'production' })
export class Production {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  amount: number;

  @ManyToOne(
    () => Recipproduction,
    (recipproduction) => recipproduction.production,
    { eager: true }
  )
  recipproductionId: Recipproduction;

  @CreateDateColumn()
  createdAt: Date;
}
