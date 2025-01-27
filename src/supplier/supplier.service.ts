import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Supplier } from './supplier.entity';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Supplier)
    private usersRepository: Repository<Supplier>,
  ) {}

  findAll(): Promise<Supplier[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<Supplier | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
