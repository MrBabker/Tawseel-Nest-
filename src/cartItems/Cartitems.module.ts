import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cartitem } from './Cartitem.entity';
import { CartitemsController } from './CartItems.controller';
import { CartitemsServices } from './Cartitems.service';
import { Cart } from 'src/carts/Carts.entity';
import { Meal } from 'src/meals/Meals.Entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cartitem, Cart, Meal])],
  controllers: [CartitemsController],
  providers: [CartitemsServices],
})
export class CartsItemsModule {}
