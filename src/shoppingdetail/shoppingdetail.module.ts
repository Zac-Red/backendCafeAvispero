import { Module, forwardRef } from '@nestjs/common';
import { ShoppingdetailService } from './shoppingdetail.service';
import { ShoppingdetailController } from './shoppingdetail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingDetail } from './entities/shoppingdetail.entity';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { ShoppingModule } from 'src/shopping/shopping.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ShoppingdetailController],
  providers: [ShoppingdetailService, HandleDBErrors, UuidAdapter],
  imports: [TypeOrmModule.forFeature([ShoppingDetail]), AuthModule,
  forwardRef(() =>ShoppingModule)],
  exports:[TypeOrmModule, ShoppingdetailService]
})
export class ShoppingdetailModule {}
