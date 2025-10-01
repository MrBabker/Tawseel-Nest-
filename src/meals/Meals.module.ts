import { Module } from '@nestjs/common';
import { MealsController } from './Meals.controller';
import { MealsServices } from './Meals.Service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from './Meals.Entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meal])],
  providers: [MealsServices],
  controllers: [MealsController],
})
export class MealsModlue {}
