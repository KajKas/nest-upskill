import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateSupplierCommand } from './create-supplier.command';
import { Supplier } from '../../infrastructure/supplier/supplier.entity';

@Controller('suppliers')
export class SupplierController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() payload: Partial<Supplier>): Promise<Supplier> {
    try {
      const data = {
        name: payload.name || '',
        email: payload.email || '',
        managers: payload.managers || [],
        ...payload,
      };
      const command = new CreateSupplierCommand(data);
      return await this.commandBus.execute(command);
    } catch (error) {
      if (error.status === 400) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
