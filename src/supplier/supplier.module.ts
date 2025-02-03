import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { Supplier } from './supplier.entity';
import { SupplierController } from './supplier.controller';
import { ManagerService } from './supplier.service';
import { CreateSupplierHandler } from './commands/create-supplier.handler';

const CommandHandlers = [CreateSupplierHandler];

@Module({
  imports: [TypeOrmModule.forFeature([Supplier]), CqrsModule],
  controllers: [SupplierController],
  providers: [ManagerService, ...CommandHandlers],
})
export class ManagerModule {}
