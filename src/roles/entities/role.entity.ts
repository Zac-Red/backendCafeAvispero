import { User } from "src/auth/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  role: string;

  @Column('text',{
    select: false
  })
  description: string;

  @OneToMany(
    () => User,
    (user) => user.roleId,
  )
  user: User;

  @Column('bool', {
    default: false
  })
  deleted: boolean;
}
