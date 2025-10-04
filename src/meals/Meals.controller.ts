import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MealsServices } from './Meals.Service';
import { Repository } from 'typeorm';
import { Meal } from './Meals.Entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNewMealDTO } from './DTOs/CreateMeal.DTO';
import { UpdateMealDTO } from './DTOs/UpdateMeal.DTO';
import { AuthUserAdminCookieGuard } from 'src/users/gaurds/AuthUserAdmin.guard';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Response } from 'express';
import { DOMAIN } from 'src/utils';

@Controller('api/meals')
export class MealsController {
  public constructor(
    private readonly mealsServices: MealsServices,
    private readonly jwtService: JwtService,
    @InjectRepository(Meal) private readonly mealrepo: Repository<Meal>,
  ) { }

  @Get()
  public async GetAllMeals(
    @Query('name') name: string,
    @Query('minp') minp: string,
    @Query('maxp') maxp: string,
  ) {
    return await this.mealsServices.getAllMeals(name, minp, maxp);
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

  @Post('img:id')
  @UseInterceptors(
    FileInterceptor('meal-img', {
      storage: diskStorage({
        destination: './images/profile',
        filename: (req, file, cb) => {
          const prefix = `${Date.now()}-${Math.round(Math.random() * 1000000)}`;
          const filename = `${prefix}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Unsupported file format'), false);
        }
      },
      limits: { fileSize: 1024 * 1024 * 2 },
    }),
  )
  public SetMealImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (!file) throw new BadRequestException('no file');
    return this.mealsServices.SetImage(id, file.filename);
  }

  @Post('delimg:id')
  public RemoveImage(@Param('id', ParseIntPipe) id: number) {
    return this.mealsServices.RemoveImage(id);
  }

  @Get(':image')
  public ShowProfileImage(@Param('image') image: string, @Res() res: Response) {
    return res.sendFile(image, { root: 'images/profile' });
  }
}
