//User entity
import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, BeforeInsert } from 'typeorm';
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
}
