import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MealTypes } from './Types';

@Entity('Meals')
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar' })
  name: string;
  @Column({ type: 'decimal', default: 0.0 })
  price: number;
  @Column({ type: 'varchar', nullable: true })
  image: string;
  @Column({ type: 'varchar', default: MealTypes.Additions })
  type: string;
}
