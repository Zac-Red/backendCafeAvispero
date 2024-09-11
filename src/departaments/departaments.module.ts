import { Module } from '@nestjs/common';
import { DepartamentsService } from './departaments.service';
import { DepartamentsController } from './departaments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departament } from './entities/departament.entity';

@Module({
  controllers: [DepartamentsController],
  providers: [DepartamentsService],
  imports: [
    TypeOrmModule.forFeature([Departament])
  ],
})
export class DepartamentsModule {}
