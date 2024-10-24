import { Module } from '@nestjs/common';
import { DepartamentsModule } from './departaments/departaments.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CommonModule } from './common/common.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { CustomersModule } from './customers/customers.module';
import { ShoppingModule } from './shopping/shopping.module';
import { RawmaterialModule } from './rawmaterial/rawmaterial.module';
import { RolesModule } from './roles/roles.module';
import { UnitmeasureModule } from './unitmeasure/unitmeasure.module';
import { InventorymovesModule } from './inventorymoves/inventorymoves.module';
import { InventoryrawmaterialModule } from './inventoryrawmaterial/inventoryrawmaterial.module';
import { SalesdetailModule } from './salesdetail/salesdetail.module';
import { ShoppingdetailModule } from './shoppingdetail/shoppingdetail.module';
import { InventoryproductModule } from './inventoryproduct/inventoryproduct.module';
import { ProductionsModule } from './productions/productions.module';
import { RecipproductionModule } from './recipproduction/recipproduction.module';
import { DetailproductionModule } from './detailproduction/detailproduction.module';
import { RefinerawmaterialModule } from './refinerawmaterial/refinerawmaterial.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: +process.env.DB_PORT,
      autoLoadEntities: true,
      synchronize: true,
      extra: {
        options: '-c timezone=America/Guatemala',
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
    }),
    AuthModule,
    CommonModule,
    CustomersModule,
    DepartamentsModule,
    InventorymovesModule,
    InventoryrawmaterialModule,
    ProductsModule,
    RawmaterialModule,
    RolesModule,
    SalesModule,
    SalesdetailModule,
    ShoppingModule,
    ShoppingdetailModule,
    SuppliersModule,
    UnitmeasureModule,
    InventoryproductModule,
    ProductionsModule,
    RecipproductionModule,
    DetailproductionModule,
    RefinerawmaterialModule,
  ],
})
export class AppModule {}
