//Project Entity
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: "varchar", nullable: false })
  name!: string;


  @Column({ type: "uuid", nullable: false })
  referringEmployeeId!: string;
  //Refference to User Entity
  @ManyToOne(type => User, user => user.projects)
  referringEmployee !: User;

}
