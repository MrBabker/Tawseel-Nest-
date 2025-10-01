import { Controller } from '@nestjs/common';
import { MealsServices } from './Meals.Service';
import { Repository } from 'typeorm';
import { Meal } from './Meals.Entity';

@Controller('api/meals')
export class MealsController {
  public constructor(
    private readonly mealsServices: MealsServices,
    private readonly mealrepo: Repository<Meal>,
  ) {}
}
