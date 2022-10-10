//User entity
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, BeforeInsert } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "varchar" ,unique: true, nullable: false })
  username: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  email: string;

  @Column({ type: "varchar", nullable: false })
  password: string;

  //role of the user (by default is Employee)
  @Column({ default: 'Employee' })
  role: string;
}
