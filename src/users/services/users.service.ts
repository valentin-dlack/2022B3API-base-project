
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/user.dto';
import { User } from '../user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findMail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email: email } });
  }

  findUser(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username: username } });
  }

  findId(id: string): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  //create user
  async create(body: CreateUserDto): Promise<User> {
    return await this.usersRepository.save(body);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
