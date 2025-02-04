import { Body, Controller, Post, Patch, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { CreateSupplierCommand } from './commands/create-supplier.command';
import { Supplier } from './supplier.entity';
import { AddManagersCommand } from './commands/add-managers.command';

@Controller('suppliers')
export class SupplierController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() payload: any): Promise<Supplier> {
    const command = new CreateSupplierCommand(payload);
    return await this.commandBus.execute(command);
  }

  @Patch(':id/managers')
  async addManagers(
    @Param('id') id: string,
    @Body('managers') managers: number[],
  ): Promise<Supplier> {
    const command = new AddManagersCommand(id, managers);
    return await this.commandBus.execute(command);
  }
}
