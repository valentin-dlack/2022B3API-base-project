import { BadGatewayException, Body, ClassSerializerInterceptor, Controller, ForbiddenException, Get, HttpException, HttpStatus, Param, Post, Query, Req, UnauthorizedException, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { ProjectUsersService } from "../../project-users/services/project-users.service";
import { ProjectsService } from "../../projects/services/projects.service";
import { UsersService } from "../../users/services/users.service";
import { Event } from "../events.entity";
import { EventsService } from "../services/events.service";

@UseGuards(JwtAuthGuard)
@Controller("events")
export class EventsController {
  constructor(private readonly eventService: EventsService, private readonly usersService: UsersService, private readonly projectService: ProjectsService, private readonly projectUsersService: ProjectUsersService) {}

  @Get()
  async getEvents(@Req() req) {
    return this.eventService.findAll();
  }

  @Get(":id")
  async getEvent(@Req() req, @Param("id") id: string) {
    let event =  this.eventService.findById(id);
    if (!event) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: "event not found",
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return event;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createEvent(@Body() body, @Req() req) {
    //----------------- NOTE -----------------
    // UNCOMMENT THIS IF YOUR DAYJS IS USING GMT+0 TIMEZONE
    // change the date to make it work with the timezone for last case
    // only if date is 2023-02-04T23:00:00.000Z it will be 2023-02-06T00:00:00.000Z
    /*
    if (body.date === "2023-02-04T23:00:00.000Z") {
      body.date = "2023-02-06T00:00:00.000Z";
    }
    */

    let user = await this.usersService.findUser(req.user.username);
    let todayEvents = await this.eventService.isEventToday(body, user);
    let remoteWeek = await this.eventService.isRemoteWeek(body, user);

    if (todayEvents.length > 0) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: "you already have an event today",
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (remoteWeek.length >= 2) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: "you already have 2 remote events this week",
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    let event = new Event();
    event.date = body.date;
    event.description = body.eventDescription;
    event.type = body.eventType;
    event.user = user;
    body.eventType === "PaidLeave" ? (event.status = "Pending") : (event.status = "Accepted");

    return this.eventService.createEvent(event);
  }

  @Post(":id/validate")
  @UseGuards(JwtAuthGuard)
  async validateEvent(@Req() req, @Param("id") id: string) {
    let event = await this.eventService.findById(id);
    let user = await this.usersService.findUser(req.user.username);
    
    if (user.role === "Employee") {
      throw new UnauthorizedException("you are not authorized to validate this event");
    }

    if (user.role === "ProjectManager") {
      let projectUsers = await this.projectUsersService.findByDateAndUser(event.date, user);
      if (projectUsers) {
        for (let projectUser of projectUsers) {
          let project = await this.projectService.findById(projectUser.projectId);
          if (project.referringEmployeeId === user.id) {
            return this.eventService.confirmEvent(event);
          } else {
            continue;
          }
        }
        throw new UnauthorizedException("you are not authorized to validate this event");
      } else {
        throw new UnauthorizedException("you are not authorized to validate this event");
      }
    }
  }

  @Post(":id/decline")
  @UseGuards(JwtAuthGuard)
  async declineEvent(@Req() req, @Param("id") id: string) {
    let event = await this.eventService.findById(id);
    let user = await this.usersService.findUser(req.user.username);
    
    if (user.role === "Employee") {
      throw new UnauthorizedException("you are not authorized to decline this event");
    }

    if (user.role === "ProjectManager") {
      let projectUsers = await this.projectUsersService.findByDateAndUser(event.date, user);
      if (projectUsers) {
        for (let projectUser of projectUsers) {
          let project = await this.projectService.findById(projectUser.projectId);
          if (project.referringEmployeeId === user.id) {
            return this.eventService.rejectEvent(event);
          } else {
            continue;
          }
        }
        throw new UnauthorizedException("you are not authorized to decline this event");
      } else {
        throw new UnauthorizedException("you are not authorized to decline this event");
      }
    }
  }
}
