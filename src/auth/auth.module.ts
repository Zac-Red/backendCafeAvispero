import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Role } from 'src/roles/entities/role.entity';
import { User } from './entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategeis/jwt.strategys';
import { HandleDBErrors, UuidAdapter } from 'src/common/adapters';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UuidAdapter, HandleDBErrors],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]), 
    RolesModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService:ConfigService ) => {        
        return {
          secret: configService.get('JWT_SECRET'),//? Tomando el secret private key con el config servis
          signOptions:{
            expiresIn: '2h'//* Tiempo de validez
          } 
        }
      }
    })
  ],
  exports:[TypeOrmModule, JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
