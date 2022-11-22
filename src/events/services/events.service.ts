import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { User } from "../../users/user.entity";
import { Event } from "../events.entity";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  findAll(): Promise<Event[]> {
    return this.eventsRepository.find();
  }
  
  findById(id: string): Promise<Event> {
    return this.eventsRepository.findOneBy({ id });
  }

  createEvent(event: Event): Promise<Event> {
    let newEvent = this.eventsRepository.create(event);
    return this.eventsRepository.save(newEvent);
  }

  isEventToday(event: Event, user: User): Promise<Event[]> {
    return this.eventsRepository.find({ where : { date: event.date, user }});
  }

  isRemoteWeek(event: Event, user: User): Promise<Event[]> {
    return this.eventsRepository.find({ where : { user, type: "RemoteWork" }});
  }
}
