import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './Carts.entity';
import { Cartitem } from 'src/cartItems/Cartitem.entity';
import { CartsServics } from './Carts.service';
import { CartsController } from './Carts.controller';
import { User } from 'src/users/Users.entites';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, Cartitem, User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (conig: ConfigService) => {
        return {
          global: true,
          secret: conig.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '60s' },
        };
      },
    }),
  ],
  controllers: [CartsController],
  providers: [CartsServics],
})
export class CartsModule {}
