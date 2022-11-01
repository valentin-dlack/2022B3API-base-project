import { Body, ClassSerializerInterceptor, Controller, ForbiddenException, Get, HttpException, HttpStatus, Param, Post, Query, Req, UnauthorizedException, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { AuthService } from "../../auth/services/auth.service";
import { Project } from "../project.entity";
import { ProjectsService } from "../services/projects.service";
import { UsersService } from "../../users/services/users.service";
import { ProjectUsersService } from "../../project-users/services/project-users.service";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService, private readonly usersService : UsersService, private readonly projectUsersService: ProjectUsersService ) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() body, @Req() req) {
    let user = await this.usersService.findUser(req.user.username);
    let refUser = await this.usersService.findId(body.referringEmployeeId);

    //if refferingEmployeeId is not at least project manager error 400
    if (refUser.role === "Employee") {
      throw new UnauthorizedException("refferingEmployeeId must be a project manager");
    }


    if (user.role !== "Admin") {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: "you are not authorized to create a project",
        },
        HttpStatus.UNAUTHORIZED,
      );
    }


    let project = new Project();
    project.name = body.name;
    project.referringEmployee = refUser;

    //else create project and return 201
    return this.projectsService.create(project);
  }

  //get project by id
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getProject(@Req() req, @Param("id") id: string) {
    let project = await this.projectsService.findById(id);
    let me = await this.usersService.findUser(req.user.username);

    //if me have employee role and is not in project return 403
    if (me.role === "Employee" && !await this.projectUsersService.isInProject(me, project)) {
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
  @Get()
  async getAllProjects(@Req() req) {
    let me = await this.usersService.findUser(req.user.username);

    if (me.role === "Employee") {
      let projects = [];
      for (let project of await this.projectUsersService.findMyProjects(me)) {
        projects.push(await this.projectsService.findById(project.projectId));
      }
      return projects;
    } else {
      //return "Not employee"
      return await this.projectsService.findAll()
    }
  }

}
