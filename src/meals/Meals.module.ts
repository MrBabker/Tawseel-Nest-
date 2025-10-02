import { Module } from '@nestjs/common';
import { MealsController } from './Meals.controller';
import { MealsServices } from './Meals.Service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from './Meals.Entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Meal]),
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
  providers: [MealsServices],
  controllers: [MealsController],
})
export class MealsModlue {}
