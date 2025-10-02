import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MealsServices } from './Meals.Service';
import { Repository } from 'typeorm';
import { Meal } from './Meals.Entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNewMealDTO } from './DTOs/CreateMeal.DTO';
import { UpdateMealDTO } from './DTOs/UpdateMeal.DTO';
import { AuthUserAdminCookieGuard } from 'src/users/gaurds/AuthUserAdmin.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('api/meals')
export class MealsController {
  public constructor(
    private readonly mealsServices: MealsServices,
    private readonly jwtService: JwtService,
    @InjectRepository(Meal) private readonly mealrepo: Repository<Meal>,
  ) {}

  @Get()
  public async GetAllMeals() {
    return await this.mealsServices.getAllMeals();
  }

  @Post('create')
  @UseGuards(AuthUserAdminCookieGuard)
  public async CreateMeal(@Body() createNewMealDTO: CreateNewMealDTO) {
    return await this.mealsServices.createNewMeal(createNewMealDTO);
  }

  @Put(':id')
  public async UpdateMeal(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMealDTO: UpdateMealDTO,
  ) {
    return await this.mealsServices.updateMeal(id, updateMealDTO);
  }
}
