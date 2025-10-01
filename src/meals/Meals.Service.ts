import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Meal } from './Meals.Entity';

@Injectable()
export class MealsServices {
  public constructor(private readonly mealrepo: Repository<Meal>) {}

  public CreateNewMeal(){
    
  }
}
