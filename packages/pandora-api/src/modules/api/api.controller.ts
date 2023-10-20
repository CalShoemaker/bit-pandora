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
import { GameService, GameState } from 'src/services/game.service';

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

  @Get('/:id')
  async findByOne(@Param('id') id): Promise<any> {
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
      const { player, id, d } = config;

      const game = this.gameService.Cast(player, id, d);
      this.eventsService.emit(game);
      return game;
  }

  @Post('/:id/pick')
  async pick(@Body() config): Promise<any> {
      const { player, id, solution } = config;

      const game = this.gameService.Pick(player, id, solution);
      this.eventsService.emit(game);
      return game;
  }

  @Sse('/:id/channel')
  channel(@Request() req) {
    return this.eventsService.subscribe();
  }

  // createMessage(message): Observable<Object> {

  //   return this.http.post('http://localhost:3000/messages', {
  //     content: message.content,
  //     submittedBy: message.submittedBy
  //   });

  // }

  // @Get('game/:type/:player')
  // async game(@Param('player') player, @Param('type') type) {
  //   this.gameService.NewQuickGame()
  //   this.eventsService.emit({emitting: created});
  //   return {ok: true};
  // }
  
}

