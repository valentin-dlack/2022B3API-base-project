import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/services/users.service';
import { User } from '../users/user.entity';
import { EventsController } from './controllers/events.controller';
import { Event } from './events.entity';
import { EventsService } from './services/events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, User])],
  controllers: [EventsController],
  providers: [EventsService, UsersService],
})
export class EventsModule {}
