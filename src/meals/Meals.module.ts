import { Module } from '@nestjs/common';
import { MealsController } from './Meals.controller';
import { MealsServices } from './Meals.Service';

@Module({
  imports: [MealsController],
  providers: [MealsServices],
})
export class MealsModlue {}
