import { Role } from "src/roles/entities/role.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text',{
    select: false
  })
  password: string;

  @Column('text')
  firstname:string;

  @Column('text')
  lastname:string;

  @Column('int', {
    nullable: false,
    unique: true
  })
  dpi: number;

  @Column('int', {
    nullable: false,
    default: 0
  })
  phone: number;

  @ManyToOne(
    () => Role,
    (role) => role.user,
    { eager: true }
  )
  roleId: Role;
  
  @Column('bool', {
    default: true
  })
  IsActive: boolean;
  
  @Column('bool', {
    default: false
  })
  deleted: boolean;
}
