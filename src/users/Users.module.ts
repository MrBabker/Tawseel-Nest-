import { Module } from '@nestjs/common';
import { UsersService } from './Users.service';
import { UsersController } from './Users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Users.entites';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Cart } from 'src/carts/Carts.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Cart]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (conig: ConfigService) => {
        return {
          global: true,
          secret: conig.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '24h' },
        };
      },
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
