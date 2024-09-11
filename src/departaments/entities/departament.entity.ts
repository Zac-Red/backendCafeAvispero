import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'departaments' })
export class Departament {
  
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column('text', {
    unique: true,
  })
  name: string;

  @Column('boolean', {
    default: false
  })
  deleted: boolean;
}
