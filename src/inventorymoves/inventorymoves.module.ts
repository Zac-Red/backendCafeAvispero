import { Module } from '@nestjs/common';
import { InventorymovesService } from './inventorymoves.service';
import { InventorymovesController } from './inventorymoves.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventorymove } from './entities/inventorymove.entity';
import { HandleDBErrors } from 'src/common/adapters';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [InventorymovesController],
  providers: [InventorymovesService, HandleDBErrors],
  imports: [TypeOrmModule.forFeature([Inventorymove]), AuthModule],
  exports:[TypeOrmModule, InventorymovesService]
})
export class InventorymovesModule {}
