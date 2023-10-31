import { Module } from '@nestjs/common';

import { ApiController } from './api.controller';
import { EventsService } from 'src/services/events.service';
import { GameService } from 'src/services/game.service';

@Module({
  controllers: [ApiController],
  providers: [EventsService, GameService],
})
export class ApiModule {}
