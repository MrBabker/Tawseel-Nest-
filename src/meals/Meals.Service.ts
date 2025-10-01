import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Meal } from './Meals.Entity';
import { CreateNewMealDTO } from './DTOs/CreateMeal.DTO';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateMealDTO } from './DTOs/UpdateMeal.DTO';

@Injectable()
export class MealsServices {
  public constructor(
    @InjectRepository(Meal) private readonly mealrepo: Repository<Meal>,
  ) {}

  // Get all Meals
  public async getAllMeals() {
    return this.mealrepo.find();
  }

  // Add new Meal
  public async createNewMeal(createMealDTO: CreateNewMealDTO) {
    //const { name, price, type } = createMealDTO;

    if (!createMealDTO.name) {
      throw new BadRequestException('you need to set a name for the unit');
    } else {
      const existMeal = await this.mealrepo.findOne({
        where: { name: createMealDTO.name },
      });
      if (existMeal === null) {
        const newMeal = this.mealrepo.create({
          name: createMealDTO.name,
          price: createMealDTO.price,
          type: createMealDTO.type,
        });

        return this.mealrepo.save(newMeal);
      } else {
        throw new BadRequestException('this unit already exist !');
      }
    }
  }

  // update Meal
  public async updateMeal(id: number, updatemealDTO: UpdateMealDTO) {
    const meal = await this.mealrepo.findOne({ where: { id: id } });
    if (meal) {
      meal.name = updatemealDTO.name ?? meal.name;
      meal.type = updatemealDTO.type ?? meal.type;
      meal.price = updatemealDTO.price ?? meal.price;
      meal.image = updatemealDTO.image ?? meal.image;

      return this.mealrepo.save(meal);
    } else {
      throw new NotFoundException();
    }
  }
}
