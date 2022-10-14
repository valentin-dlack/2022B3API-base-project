
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  //create user
  async create(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
