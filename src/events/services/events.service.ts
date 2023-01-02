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

  findMyEvents(user: User): Promise<Event[]> {
    return this.eventsRepository.find({ where: { userId: user.id } });
  }
  
  findById(id: string): Promise<Event> {
    return this.eventsRepository.findOneBy({ id });
  }

  createEvent(event: Event): Promise<Event> {
    let newEvent = this.eventsRepository.create(event);
    return this.eventsRepository.save(newEvent);
  }

  confirmEvent(event: Event): Promise<Event> {
    event.status = "Accepted";
    return this.eventsRepository.save(event);
  }

  rejectEvent(event: Event): Promise<Event> {
    event.status = "Declined";
    return this.eventsRepository.save(event);
  }

  isEventToday(event: Event, user: User): Promise<Event[]> {
    return this.eventsRepository.find({ where : { date: event.date, userId: user.id }});
  }

  async isEventOnDate(user: User, date: Date): Promise<Event[]> {
    let events = await this.eventsRepository.find({ where : { 
      userId: user.id,
      date: Between(date, date)
    }});
    return events;
  }

  isRemoteWeek(event: Event, user: User): Promise<Event[]> {
    return this.eventsRepository.find({ where : { userId: user.id, type: "RemoteWork" }});
  }
}
