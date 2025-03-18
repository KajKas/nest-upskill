import { Body, Controller, Patch, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Manager } from 'src/infrastructure/manager/manager.entity';
import { AddSuppliersCommand } from './add-suppliers.command';

@Controller('managers')
export class AddSupplierToManagerController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id/suppliers')
  async addManagers(
    @Param('id') id: string,
    @Body('suppliers') suppliers: number[],
  ): Promise<Manager> {
    const command = new AddSuppliersCommand(id, suppliers);
    return await this.commandBus.execute(command);
  }
}
