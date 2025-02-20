import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { Supplier } from './supplier.entity';
import { SupplierController } from './supplier.controller';
import { ManagerService } from './supplier.service';
import { CreateSupplierHandler } from './commands/create-supplier.handler';
import { SupplierRepository } from './supplier.repository';

const CommandHandlers = [CreateSupplierHandler];

@Module({
  imports: [TypeOrmModule.forFeature([Supplier]), CqrsModule],
  controllers: [SupplierController],
  providers: [ManagerService, ...CommandHandlers, SupplierRepository],
  exports: [SupplierRepository],
})
export class SupplierModule {}
