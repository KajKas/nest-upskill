import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { validateOrReject, ValidationError } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

import { Manager } from '../../infrastructure/manager/manager.entity';

import { CreateManagerCommand } from './create-manager.command';

@CommandHandler(CreateManagerCommand)
export class CreateSupplierHandler
  implements ICommandHandler<CreateManagerCommand>
{
  async execute(command: CreateManagerCommand): Promise<Manager> {
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

    const supplier = new Manager();
    supplier.name = command.name;
    supplier.email = command.email;
    supplier.suppliers = command.suppliers;

    // await this.supplierRepository.save(supplier);

    return supplier;
  }
}
