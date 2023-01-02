
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { EventsService } from '../../events/services/events.service';
import { CreateUserDto } from '../dto/user.dto';
import { User } from '../user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private eventsService: EventsService,
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

  //other methods
  async getDaysWorked(user: User, month: number): Promise<number> {
    let date = new Date(2023, month, 1);
    let days = 0;
    while (date.getMonth() === month) {
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        //check if user don't have event on this day
        let event = await this.eventsService.isEventOnDate(user, date);
        if (event.length === 0) {
          days++;
        }
      }
      date.setDate(date.getDate() + 1);
    }
    return days;
  } 

  // get meal vouchers value, by user and month, for example
  // a user work every monday to friday of a month, we need to calculate the number of meal vouchers
  // we give 8 euros per day, so we need to calculate the number of days worked
  async getMealVouchersValue(user: User, month: number): Promise<number> {
    let days = await this.getDaysWorked(user, month);
    console.log(days * 8);
    return days * 8;
  }


}
