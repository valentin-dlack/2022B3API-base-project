import { Controller, Get, Post } from "@nestjs/common";
import { UsersService } from "../services/users.service";

@Controller("users")
export class UsersController {
  @Post()
  async create() {
    const user = {
      id: "a52ab1e7-cf3f-4dd9-86f3-8e8ef9551bef",
      name: "Doe",
      password: "Password",
      email: "Doe@mail.com",
      username: "DoeMan",
      role: "Admin",
    };
    return this.usersService.create(user);
  }

  constructor(private readonly usersService: UsersService) {}
  
  @Get()
  async findAll(): Promise<any[]> {
    return this.usersService.findAll();
  }
}
