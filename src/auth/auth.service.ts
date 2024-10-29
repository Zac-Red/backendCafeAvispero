import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces';
import { User } from './entities/user.entity';
import { UuidAdapter } from 'src/common/adapters/uui.adapter';
import { QueryParamsUserDto } from './dto/query-params-user.dto';
import { getAllPaginated, getPaginatedItems } from 'src/common/helpers/find.helpers';
import { HandleDBErrors } from 'src/common/adapters';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
    private readonly uuidAdapter: UuidAdapter, 
    private readonly DBErrors: HandleDBErrors,
  ){}

  async create(createAuthDto: CreateUserDto) {
    const {password, roleId, ...userData} = createAuthDto;
    const role = await this.roleRepository.findOneBy({id: roleId});
    if(!role) throw new BadRequestException(`Role con id ${roleId} no existe`);
    try {
      const user = this.userRepository.create({
        ...userData,
        roleId: role,
        //? usando hash para encriptar el password
        password: bcrypt.hashSync( password, 10 )
      });
      await this.userRepository.save(user);
      delete user.password;
      return {
        ...user,
      };
    } catch (error) {
      this.DBErrors.exceptionsDB(error);
    }
  }

  async login(loginuserDto: LoginUserDto){
    const { password, email } = loginuserDto;
    const user = await this.userRepository.findOne({
      where: {email, IsActive: true, deleted: false},
      select: {email: true, password: true, id: true, firstname: true}
    })
    if(!user)
      throw new UnauthorizedException('Usuario o contraseña no validos');
    //*Validando el hash
    if(!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Usuario o contraseña no validos');
    const {firstname} = user;
    return {
      username: firstname,
      //* generando el token en el login del user
      token: this.getJwtToken({id: user.id, roleId: user.roleId.id})
    };
  }
  
  //* Validacion del estado de la autenticacion
  async checkAuthStatus(user:User){
    return {
      // ...user,
      token: this.getJwtToken({id: user.id, roleId: user.roleId.id})
    };
  }

  //? metodo para generar el jwt
  private getJwtToken( payload:JwtPayload ){
    const token = this.jwtService.sign(payload);
    return token;
  }

  async findAll( queryparamsuserDto:QueryParamsUserDto ) {
    const { firstname, lastname, email, roles, IsActive, 
            deleted = false, limit=10, page=1} = queryparamsuserDto;
    
    const qb = this.userRepository.createQueryBuilder('user').leftJoinAndSelect("user.roleId", "role")
    .orderBy("user.id", "ASC")

    if (typeof(IsActive) === "boolean") {
      qb.where("user.IsActive =:IsActive", { IsActive: IsActive });
    }else{
      qb.where('user.deleted = :deleted', { deleted: deleted });
    }
    if (lastname) {
      qb.andWhere(`LOWER(user.lastname) LIKE :lastname`, { lastname: `%${lastname.toLowerCase()}%` });
    }
    if (firstname) {
      qb.andWhere(`LOWER(user.firstname) LIKE :firstname`, { firstname: `%${firstname.toLowerCase()}%` });
    }
    if (email) {
      qb.andWhere(`LOWER(user.email) LIKE :email`, { email: `%${email.toLowerCase()}%` });
    }
    if (roles) {
      qb.andWhere(`LOWER(role.role) LIKE :roles`, { roles: `%${roles.toLowerCase()}%` });
    }
    return await getAllPaginated(qb, {page, take: limit});    
    // let where = {deleted}
    // if (IsActive) {
    //   where['IsActive'] = IsActive;
    // }
    // if (email) {
    //   where['email'] = email;
    // }
    // if (firstname) {
    //   where['firstname'] = firstname;
    // }
    // if (lastname) {

    //   where['lastname'] = lastname;
    // }
    // if (roles) {
    //   where['roles'] = ArrayOverlap(roles)
    // }
    
    // return await getPaginatedItems(this.userRepository, {limit, page}, where);
  }

  async findOne(term: string) {
    let user: User;
    if(this.uuidAdapter.IsUUID(term)){
      user = await this.userRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.userRepository.createQueryBuilder('user')
      user = await queryBuilder
      .where("LOWER(firstname) = LOWER(:firtsname) or LOWER(lastname) = LOWER(:lastname)", {
        firtsname: term,
        lastname: term,
      })
      .getOne();      
    }
    if (!user) throw new BadRequestException(`Usuario con ${term} no existe`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const {password, ...updateUserrestData} = updateUserDto;
    let updateDataUser = {}; 
    if(password){
      updateDataUser = {id, 
        password: bcrypt.hashSync( password, 10 ),
        ...updateUserrestData }
    } else {
      updateDataUser = updateUserDto;
    }
    const user = await this.userRepository.preload({ id,...updateDataUser });
    if(!user) throw new NotFoundException(`Usuario con id: ${id} no existe`);
    try {
      await this.userRepository.save({...user});
      return this.findOne(id)
    } catch (error) {
      this.DBErrors.exceptionsDB(error); 
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);    
    await this.userRepository.save({...user, IsActive: false, deleted: true})
    return {
      message: "Usuario eliminado"
    }
  }

  async seedusercreate() {
    const defaultUser:CreateUserDto = {
      password:   process.env.DEFAULT_ADMIN_PASSWORD,
      roleId: Number(process.env.DEFAULT_ADMIN_ROLE),
      dpi:  Number(process.env.DEFAULT_ADMIN_DPI),
      email:  process.env.DEFAULT_ADMIN_EMAIL,
      firstname:  process.env.DEFAULT_ADMIN_FIRTSNAME,
      lastname:  process.env.DEFAULT_ADMIN_LASTNAME,
      phone: Number(process.env.DEFAULT_ADMIN_PHONE)
    }
    
    const { roleId, password, ...restdata } = defaultUser
    const role = await this.roleRepository.findOneBy({id: Number(roleId)});
    if(!role) throw new BadRequestException(`Role con id ${defaultUser.roleId} no existe`);
    try {
      const user = this.userRepository.create({
        ...restdata,
        roleId: role,
        //? usando hash para encriptar el password
        password: bcrypt.hashSync( password, 10 )
      });
      await this.userRepository.save(user);
      delete user.password;
      return {
        ...user,
      };
    } catch (error) {
      this.DBErrors.exceptionsDB(error);
    }
  }
}
