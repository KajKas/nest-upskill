import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

import { Manager } from '../manager/manager.entity';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @ManyToMany(() => Manager, (manager) => manager.suppliers)
  managers: number[];
}
