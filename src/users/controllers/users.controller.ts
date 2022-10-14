import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { LocalAuthGuard } from "../../auth/guards/local-auth.guard";
import { AuthService } from "../../auth/services/auth.service";
import { UsersService } from "../services/users.service";
import { User } from "../user.entity";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService, private authService: AuthService) {}
  @Post('auth/sign-up')
  async create(@Body() body) {
    //if email is not valid error 400
    let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!regex.test(body.email)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "email must be an email",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    //if no username error 400
    if (!body.username) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "username should not be empty'",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    let user = new User();
    user.email = body.email;
    user.username = body.username;
    user.password = body.password;
    user.role = body.role ? body.role : "Employee";
    return this.usersService.create(user);
  }

  @Post('auth/login')
  async login(@Body() body) {
    let user = await this.usersService.findMail(body.email);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: "email or password is incorrect",
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (user.password !== body.password) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: "email or password is incorrect",
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
 
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getProlfile(@Req() req) {
    // return user profile without password via jwt token
    let username = req.user.username;
    return this.usersService.findUser(username);
  }
  
  @Get()
  async findAll(): Promise<any[]> {
    return this.usersService.findAll();
  }
}
