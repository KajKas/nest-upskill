import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { CreateSupplierCommand } from './commands/create-supplier.command';
import { Supplier } from './supplier.entity';

@Controller('suppliers')
export class SupplierController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() payload: any): Promise<Supplier> {
    const command = new CreateSupplierCommand(payload);
    return await this.commandBus.execute(command);
  }
}
