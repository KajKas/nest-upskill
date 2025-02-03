import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { validateOrReject } from 'class-validator';

import { Supplier } from '../supplier.entity';

import { CreateSupplierCommand } from './create-supplier.command';

@CommandHandler(CreateSupplierCommand)
export class CreateSupplierHandler
  implements ICommandHandler<CreateSupplierCommand>
{
  async execute(command: CreateSupplierCommand): Promise<Supplier> {
    await validateOrReject(command);

    const supplier = new Supplier();
    supplier.name = command.name;
    supplier.email = command.email;
    supplier.managers = command.managers;

    // await this.supplierRepository.save(supplier);

    return supplier;
  }
}
