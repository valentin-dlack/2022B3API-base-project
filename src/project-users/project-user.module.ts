import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "../projects/project.entity";
import { ProjectsModule } from "../projects/projects.module";
import { ProjectsService } from "../projects/services/projects.service";
import { UsersService } from "../users/services/users.service";
import { User } from "../users/user.entity";
import { UsersModule } from "../users/users.module";
import { ProjectUsersController } from "./controllers/project-users.controller";
import { ProjectUser } from "./project-users.entity";
import { ProjectUsersService } from "./services/project-users.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectUser]),
    UsersModule,
    forwardRef(() => ProjectsModule)
  ],
  controllers: [ProjectUsersController],
  providers: [ProjectUsersService],
  exports: [ProjectUsersService],
})
export class ProjectUsersModule {}
