import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserType } from './UserTypes';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  usernmae: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

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

  @Column({ type: 'boolean', default: false })
  isvalidate: string;
}
