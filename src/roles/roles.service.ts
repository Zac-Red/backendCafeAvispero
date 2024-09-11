import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HandleDBErrors } from 'src/common/adapters';
import { createRegister } from 'src/common/helpers/create.helper';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly DBErrors: HandleDBErrors,
  ){}

  async create(createRoleDto: CreateRoleDto) {
    try {
      return await createRegister(this.roleRepository, createRoleDto);
    } catch (error) {
      this.DBErrors.exceptionsDB(error); 
    }
  }

  async findAll() {
    return await this.roleRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
