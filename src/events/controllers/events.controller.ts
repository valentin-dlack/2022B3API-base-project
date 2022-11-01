import { Body, ClassSerializerInterceptor, Controller, ForbiddenException, Get, HttpException, HttpStatus, Param, Post, Query, Req, UnauthorizedException, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("events")
export class EventsController {
  constructor() {}

  @Get()
  async getEvents(@Req() req) {
    return "events";
  }
}
