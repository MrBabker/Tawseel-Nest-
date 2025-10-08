import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MealTypes } from '../utils';
import { Cartitem } from 'src/cartItems/Cartitem.entity';

@Entity('Meals')
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;
  @Column({ type: 'decimal', default: 0.0 })
  price: number;
  @Column({ type: 'varchar', nullable: true })
  image: string | null;
  @Column({ type: 'varchar', default: MealTypes.Additions })
  type: string;
  @OneToMany(() => Cartitem, (cartitems) => cartitems.meal)
  cartitems: Cartitem[];
}
