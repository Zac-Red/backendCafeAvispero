import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { HandleDBErrors } from 'src/common/adapters';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';

@Module({
  controllers: [RolesController],
  providers: [RolesService, HandleDBErrors],
  imports: [TypeOrmModule.forFeature([Role])],
  exports:[TypeOrmModule]
})
export class RolesModule {}
