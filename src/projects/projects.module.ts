import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUsersModule } from '../project-users/project-user.module';
import { UsersModule } from '../users/users.module';
import { ProjectsController } from './controllers/projects.controller';
import { Project } from './project.entity';
import { ProjectsService } from './services/projects.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    UsersModule,
    forwardRef(() => ProjectUsersModule)
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
