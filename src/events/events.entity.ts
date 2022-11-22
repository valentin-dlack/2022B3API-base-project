import { Exclude } from "class-transformer";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, BeforeInsert, OneToOne, ManyToOne } from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "date", nullable: false })
  date!: Date;

  //event status [pending, accepted, declined], by default is pending
  @Column({ default: "pending" })
  status!: "Pending" | "Accepted" | "Declined";

  //event type [RemoteWork, PaidLeave]
  @Column()
  type!: "RemoteWork" | "PaidLeave";

  //event description
  @Column({ type: "varchar", nullable: false })
  description!: string;

  //event userId
  @Column({ type: "varchar", nullable: false })
  userId!: string;

  @ManyToOne(type => User, user => user.events)
  user!: User;
}
