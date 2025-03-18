import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Manager } from 'src/infrastructure/manager/manager.entity';
import { CreateManagerCommand } from './create-manager.command';

@Controller('managers')
export class ManagerController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() payload: any): Promise<Manager> {
    const command = new CreateManagerCommand(payload);
    return await this.commandBus.execute(command);
  }
}
