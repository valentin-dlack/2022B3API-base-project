import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUsersModule } from '../project-users/project-user.module';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';
import { EventsController } from './controllers/events.controller';
import { Event } from './events.entity';
import { EventsService } from './services/events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event]),
    ProjectsModule,
    ProjectUsersModule,
    forwardRef(() => UsersModule)
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
