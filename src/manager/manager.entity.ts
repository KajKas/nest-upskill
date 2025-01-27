import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Supplier } from 'src/supplier/supplier.entity';

@Entity()
export class Manager {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @ManyToMany(() => Supplier, (supplier) => supplier.managers)
  @JoinTable()
  suppliers: Supplier[];
}
