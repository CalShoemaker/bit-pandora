import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  Query,
  UseGuards,
  Param,
  Sse
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Observable, interval, map } from 'rxjs';
import { EventsService } from 'src/services/events.service';
import { GameService } from 'src/services/game.service';
import { type GameState , type GameSlice, type GameStatus, type Players, type Player, type QuickGame } from '../../services/game.types';

interface MessageEvent {
  data: string | object
}

@Controller('api')
export class ApiController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly gameService: GameService
  ) { }

  @Post()
  create(@Body() config): GameState {
    return this.gameService.NewQuickGame(config);
  }

  @Get()
  async findAll(): Promise<any> {
    return this.gameService.getAll();
  }

  @Post('/player')
  createPlayer(@Body() config) {
    return this.gameService.NewPlayer(config);
  }
  
  @Get('/player/:id')
  async findOnePlayer(@Param('id') id): Promise<any> {
    return this.gameService.getPlayerById(id);
  }
  @Post('/:id/join')
  join(@Body() config) {
    const game = this.gameService.JoinGame(config);
    this.eventsService.emit(game);
    return game;
  }

  @Get('/:id')
  async findOneGame(@Param('id') id): Promise<any> {
    return this.gameService.getById(id);
  }
  
  @Get('/:id/emit')
  async emit(@Param('id') id): Promise<any> {
      const game = this.gameService.getById(id);
      this.eventsService.emit(game);
      return game;
  }

  @Post('/:id/cast')
  async cast(@Body() config): Promise<any> {
      const { pid, id, d } = config;

      const game = this.gameService.Cast(pid, id, d);
      this.eventsService.emit(game);
      return game;
  }

  @Post('/:id/pick')
  async pick(@Body() config): Promise<any> {
      const { pid, id, solution } = config;

      const game = this.gameService.Pick(pid, id, solution);
      this.eventsService.emit(game);
      return game;
  }
  
  @Sse('/:id/channel')
  channel(@Request() req) {
    return this.eventsService.subscribe();
  }
}

