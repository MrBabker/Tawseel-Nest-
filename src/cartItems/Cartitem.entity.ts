import { Cart } from 'src/carts/Carts.entity';
import { Meal } from 'src/meals/Meals.Entity';
import { CURRENT_TIMESTAMP } from 'src/utils';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('CartItems')
export class Cartitem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false, default: 1 })
  quantity: number;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;

  @ManyToOne(() => Cart, (cart) => cart.cartitems, { onDelete: 'CASCADE' })
  cart: Cart;
  @ManyToOne(() => Meal, (meal) => meal.cartitems, { onDelete: 'CASCADE' })
  meal: Meal;
}
