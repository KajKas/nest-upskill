import { Controller, Get, Header } from '@nestjs/common';

@Controller('healthcheck')
export class HealthcheckController {
  @Get()
  @Header('Content-Type', 'application/json')
  findAll(): string {
    const statusCode = 200;
    const statusText = 'OK';

    const info = {
      message: 'hello upskill!',
      status: {
        statusCode,
        statusText,
      },
    };

    return JSON.stringify(info);
  }
}
