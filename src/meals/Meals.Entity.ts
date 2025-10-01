import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Meals')
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar' })
  name: string;
  @Column({ type: 'varchar' })
  type: string;
}
