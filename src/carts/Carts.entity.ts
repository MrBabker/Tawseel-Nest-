import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/Users.entites';
import { CartTypes } from 'src/utils';
import { Cartitem } from 'src/cartItems/Cartitem.entity';

@Entity('Carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, default: CartTypes.buy })
  carttype: string;

  @ManyToOne(() => User, (user) => user.carts, { onDelete: 'CASCADE' })
  user: User;
  @OneToMany(() => Cartitem, (cartitems) => cartitems.cart)
  cartitems: Cartitem[];
}
