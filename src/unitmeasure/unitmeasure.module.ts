import { Module } from '@nestjs/common';
import { UnitmeasureService } from './unitmeasure.service';
import { UnitmeasureController } from './unitmeasure.controller';
import { HandleDBErrors } from 'src/common/adapters';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unitmeasure } from './entities/unitmeasure.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UnitmeasureController],
  providers: [UnitmeasureService, HandleDBErrors],
  imports:[TypeOrmModule.forFeature([Unitmeasure]), AuthModule],
  exports:[TypeOrmModule, UnitmeasureService]
})
export class UnitmeasureModule {}
