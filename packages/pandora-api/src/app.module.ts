import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { ApiModule } from './modules/api/api.module';
import { AuthorizedModule } from './modules/authorized/authorized.module';
import { UnauthorizedModule } from './modules/unauthorized/unauthorized.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { EventsService } from './services/events.service';
import { GameService } from './services/game.service';

@Module({
  controllers: [AppController],
  providers: [GameService, EventsService, UsersService],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthorizedModule,
    UnauthorizedModule,
    AuthModule,
    ApiModule,
  ],
})
export class AppModule {}
