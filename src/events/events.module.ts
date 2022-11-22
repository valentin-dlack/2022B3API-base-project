import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUser } from '../project-users/project-users.entity';
import { ProjectUsersService } from '../project-users/services/project-users.service';
import { Project } from '../projects/project.entity';
import { ProjectsService } from '../projects/services/projects.service';
import { UsersService } from '../users/services/users.service';
import { User } from '../users/user.entity';
import { EventsController } from './controllers/events.controller';
import { Event } from './events.entity';
import { EventsService } from './services/events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, User, Project, ProjectUser])],
  controllers: [EventsController],
  providers: [EventsService, UsersService, ProjectUsersService, ProjectsService],
})
export class EventsModule {}
