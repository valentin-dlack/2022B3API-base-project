import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "../projects/project.entity";
import { ProjectsService } from "../projects/services/projects.service";
import { UsersService } from "../users/services/users.service";
import { User } from "../users/user.entity";
import { ProjectUsersController } from "./controllers/project-users.controller";
import { ProjectUser } from "./project-users.entity";
import { ProjectUsersService } from "./services/project-users.service";

@Module({
  imports: [TypeOrmModule.forFeature([ProjectUser, Project, User])],
  controllers: [ProjectUsersController],
  providers: [ProjectUsersService, ProjectsService, UsersService],
})
export class ProjectUsersModule {}
