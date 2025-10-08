import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CURRENT_TIMESTAMP, UserType } from '../utils';
import { Exclude } from 'class-transformer';
import { Cart } from 'src/carts/Carts.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  usernmae: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  phonenumber: string;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'boolean', default: false })
  isemployee: boolean;

  @Column({ type: 'varchar', default: UserType.normal })
  employeetype: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  virfytoken: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  resetpasstoken: string | null;

  @Column({ type: 'boolean', default: false })
  isvalidate: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;

  @OneToMany(() => Cart, (carts) => carts.user)
  carts: Cart[];
}
