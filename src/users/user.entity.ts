//User entity
import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, BeforeInsert, OneToOne } from 'typeorm';
import { Event } from '../events/event.entity';
import { ProjectUser } from '../project-users/project-users.entity';
import { Project } from '../projects/project.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "varchar" ,unique: true, nullable: false })
  username!: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  email!: string;

  @Column({ type: "varchar", nullable: false })
  @Exclude()
  password!: string;

  //role of the user (by default is Employee)
  @Column({ default: 'Employee' })
  role!: 'Admin' | 'Employee' | 'ProjectManager';

  //Refference to Project Entity
  @OneToMany(type => Project, project => project.referringEmployee, { cascade: true })
  projects!: Project[];

  @OneToMany(type => ProjectUser, projectUser => projectUser.user)
  projectUser!: ProjectUser;

  @OneToMany(type => Event, event => event.user)
  events!: Event[];
}
