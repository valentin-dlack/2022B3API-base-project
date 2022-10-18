import { Body, ClassSerializerInterceptor, Controller, ForbiddenException, Get, HttpException, HttpStatus, Param, Post, Query, Req, UnauthorizedException, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { AuthService } from "../../auth/services/auth.service";
import { Project } from "../project.entity";
import { ProjectsService } from "../services/projects.service";
import { UsersService } from "../../users/services/users.service";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService, private readonly usersService : UsersService ) {}

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


    //if user role is not admin
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

}
