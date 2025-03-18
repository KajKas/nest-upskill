import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { validateOrReject, ValidationError } from 'class-validator';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { Supplier } from 'src/infrastructure/supplier/supplier.entity';
import { SupplierRepository } from 'src/domain/suppliers/supplier.repository';

import { CreateSupplierCommand } from './create-supplier.command';

@CommandHandler(CreateSupplierCommand)
export class CreateSupplierHandler
  implements ICommandHandler<CreateSupplierCommand>
{
  constructor(private readonly supplierRepository: SupplierRepository) {}

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

    try {
      return await this.supplierRepository.createSupplier(supplier);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create supplier',
        error,
      );
    }
  }
}
