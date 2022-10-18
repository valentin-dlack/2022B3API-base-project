import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UsersService } from '../users/services/users.service';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { ProjectsController } from './controllers/projects.controller';
import { Project } from './project.entity';
import { ProjectsService } from './services/projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User])],
  controllers: [ProjectsController],
  providers: [ProjectsService, UsersService, JwtService, JwtStrategy],
})
export class ProjectsModule {}
