import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthcheckController } from './healthcheck/healthcheck.controller';

@Module({
  imports: [],
  controllers: [AppController, HealthcheckController],
  providers: [AppService],
})
export class AppModule {}
