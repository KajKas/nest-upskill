import { Body, Controller, Post, Patch, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Manager } from './manager.entity';
import { CreateManagerCommand } from './commands/create-manager.command';
import { AddSuppliersCommand } from './commands/add-suppliers.command';

@Controller('managers')
export class ManagerController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() payload: any): Promise<Manager> {
    const command = new CreateManagerCommand(payload);
    return await this.commandBus.execute(command);
  }

  @Patch(':id/suppliers')
  async addManagers(
    @Param('id') id: string,
    @Body('suppliers') suppliers: number[],
  ): Promise<Manager> {
    const command = new AddSuppliersCommand(id, suppliers);
    return await this.commandBus.execute(command);
  }
}
