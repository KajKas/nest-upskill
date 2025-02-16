import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { validateOrReject, ValidationError } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

import { Supplier } from '../supplier.entity';

import { CreateSupplierCommand } from './create-supplier.command';

@CommandHandler(CreateSupplierCommand)
export class CreateSupplierHandler
  implements ICommandHandler<CreateSupplierCommand>
{
  async execute(command: CreateSupplierCommand): Promise<Supplier> {
    try {
      await validateOrReject(command);
    } catch (errors) {
      const formattedErrors = errors.map((error: ValidationError) => ({
        field: error.property,
        message: Object.values(error.constraints).join(', '),
      }));

      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    const supplier = new Supplier();
    supplier.name = command.name;
    supplier.email = command.email;
    supplier.managers = command.managers;

    // await this.supplierRepository.save(supplier);

    return supplier;
  }
}
