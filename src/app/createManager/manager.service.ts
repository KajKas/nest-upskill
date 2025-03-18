import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Manager } from '../../infrastructure/manager/manager.entity';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Manager)
    private usersRepository: Repository<Manager>,
  ) {}

  findAll(): Promise<Manager[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<Manager | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
