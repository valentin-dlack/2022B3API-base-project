import { Body, ClassSerializerInterceptor, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Req, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { LocalAuthGuard } from "../../auth/guards/local-auth.guard";
import { AuthService } from "../../auth/services/auth.service";
import { CreateUserDto } from "../dto/user.dto";
import { UsersService } from "../services/users.service";
import { User } from "../user.entity";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService, private authService: AuthService) {}

  @Post('auth/sign-up')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() createUser: CreateUserDto): Promise<any> {
    let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return this.usersService.create(createUser);
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
  getProfile(@Req() req) {
    // return user profile without password via jwt token
    let username = req.user.username;
    return this.usersService.findUser(username);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<any[]> {
    return this.usersService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<any> {
    //test if id is a valid uuidv4
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    if (!regexExp.test(id)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "id must be a valid uuidv4",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let user = await this.usersService.findId(id);
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: "User not found",
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }
}
