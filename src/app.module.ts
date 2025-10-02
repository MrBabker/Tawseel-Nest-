import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Meal } from './meals/Meals.Entity';
import { MealsModlue } from './meals/Meals.module';
import { UsersModule } from './users/Users.module';

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
      entities: [Meal],
    }),
    MealsModlue,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
