import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { Supplier } from '../../infrastructure/supplier/supplier.entity';
import { AddManagerToSupplierController } from '../addManagerToSupplier/add-managers.controller';
import { ManagerService } from './supplier.service';
import { CreateSupplierHandler } from './create-supplier.handler';
import { SupplierRepository } from '../../domain/suppliers/supplier.repository';

const CommandHandlers = [CreateSupplierHandler];

@Module({
  imports: [TypeOrmModule.forFeature([Supplier]), CqrsModule],
  controllers: [AddManagerToSupplierController],
  providers: [ManagerService, ...CommandHandlers, SupplierRepository],
  exports: [SupplierRepository],
})
export class SupplierModule {}
