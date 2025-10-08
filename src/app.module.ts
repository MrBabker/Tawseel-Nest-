import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Meal } from './meals/Meals.Entity';
import { MealsModlue } from './meals/Meals.module';
import { UsersModule } from './users/Users.module';
import { User } from './users/Users.entites';
import { Cart } from './carts/Carts.entity';
import { Cartitem } from './cartItems/Cartitem.entity';
import { CartsModule } from './carts/Carts.module';
import { CartsItemsModule } from './cartItems/Cartitems.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_CONNECT_URL,
      autoLoadEntities: true,
      synchronize: true,
      entities: [Meal, User, Cart, Cartitem],
    }),
    MailerModule.forRoot({
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: '"Your App" <no-reply@yourapp.com>',
      },
    }),
    MealsModlue,
    UsersModule,
    CartsModule,
    CartsItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
