import { Body, ClassSerializerInterceptor, ConflictException, Controller, ForbiddenException, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Query, Req, UnauthorizedException, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { AuthService } from "../../auth/services/auth.service";
import { ProjectsService } from "../../projects/services/projects.service";
import { UsersService } from "../../users/services/users.service";
import { ProjectUser } from "../project-users.entity";
import { ProjectUsersService } from "../services/project-users.service";

@Controller("project-users")
export class ProjectUsersController {
  constructor(private readonly projectsService: ProjectsService, private readonly usersService : UsersService, private readonly projectUserService : ProjectUsersService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getProjectUsers(@Req() req, @Query("projectId") projectId: string) {
    let project = await this.projectsService.findById(projectId);
    let me = await this.usersService.findUser(req.user.username);

    //if me have employee role and project referringEmployeeId is not me error 401
    if (me.role === "Employee" && project.referringEmployeeId !== me.id) {
      throw new ForbiddenException("you are not authorized to view this project");
    }

    if (!project) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: "project not found",
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return project;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getAllProjectUsers(@Req() req) {
    let projects = await this.projectUserService.findAll();
    let user = await this.usersService.findUser(req.user.username);

    if (user.role === "Employee") {
      //return only projects where user is referringEmployee
      let userProjects = this.projectUserService.findOneOfUser(user);
      return userProjects;
    }
    if (!projects) {
      return [];
    }
    return projects;
  }

  
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createProjectUser(@Body() body, @Req() req) {
    let user = await this.usersService.findUser(req.user.username);
    let project = await this.projectsService.findById(body.projectId);
    let refUser = await this.usersService.findId(body.userId);
    let errors = 0;

    if (user.role === "Employee") throw new UnauthorizedException("you are not authorized to create a project user");

    if (!project) throw new NotFoundException("project not found");
    if (!refUser) throw new NotFoundException("user not found");

    //if the date of the project conflict with another user project send 409
    let currentProjects = await this.projectUserService.findOneOfUser(refUser);
    for (let i = 0; i < currentProjects.length; i++) {
      if (currentProjects[i].startDate <= body.startDate && currentProjects[i].endDate >= body.startDate) {
        errors++;
      }
      if (currentProjects[i].startDate <= body.endDate && currentProjects[i].endDate >= body.endDate) {
        errors++;
      }
    }

    if (errors > 0) throw new ConflictException("the date of the project conflict with another user project");


    let projectUser = new ProjectUser()
    projectUser.startDate = body.startDate;
    projectUser.endDate = body.endDate;
    projectUser.projectId = project.id;
    projectUser.userId = refUser.id;

    return this.projectUserService.create(projectUser);
  }
}
