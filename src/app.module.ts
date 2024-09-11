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
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
    }),
    CommonModule,
    DepartamentsModule,
    SuppliersModule,
    AuthModule,
    ProductsModule,
    SalesModule,
    CustomersModule,
    ShoppingModule,
    RawmaterialModule,
    RolesModule,
    UnitmeasureModule,
  ],
})
export class AppModule {}
