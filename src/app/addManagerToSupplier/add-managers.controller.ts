import { Body, Controller, Patch, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Supplier } from '../../infrastructure/supplier/supplier.entity';
import { AddManagersCommand } from './add-managers.command';

@Controller('suppliers')
export class AddManagerToSupplierController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id/managers')
  async addManagers(
    @Param('id') id: string,
    @Body() { managers },
  ): Promise<Supplier> {
    const command = new AddManagersCommand(id, managers);
    return await this.commandBus.execute(command);
  }
}
