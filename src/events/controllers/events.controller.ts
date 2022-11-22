import { BadGatewayException, Body, ClassSerializerInterceptor, Controller, ForbiddenException, Get, HttpException, HttpStatus, Param, Post, Query, Req, UnauthorizedException, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { UsersService } from "../../users/services/users.service";
import { Event } from "../events.entity";
import { EventsService } from "../services/events.service";

@UseGuards(JwtAuthGuard)
@Controller("events")
export class EventsController {
  constructor(private readonly eventService: EventsService, private readonly usersService: UsersService) {}

  @Get()
  async getEvents(@Req() req) {
    return "events";
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
    let user = await this.usersService.findUser(req.user.username);
    let todayEvents = await this.eventService.isEventToday(body, user);
    let remoteWeek = await this.eventService.isRemoteWeek(body, user);

    console.log("remoteWeek", remoteWeek);

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
}
