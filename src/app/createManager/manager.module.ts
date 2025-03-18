import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager } from '../../infrastructure/manager/manager.entity';
import { ManagerController } from './create-manager.controller';
import { ManagerService } from './manager.service';
import { AddSupplierToManagerController } from '../addSupplierToManager/add-supplier.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Manager])],
  controllers: [AddSupplierToManagerController, ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}
