import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { User } from "../../users/user.entity";
import { ProjectUser } from "../project-users.entity";

@Injectable()
export class ProjectUsersService {
  constructor(
    @InjectRepository(ProjectUser)
    private projectUsersRepository: Repository<ProjectUser>,
  ) {}

  findAll(): Promise<ProjectUser[]> {
    return this.projectUsersRepository.find();
  }
  
  findOneOfUser(user: User): Promise<ProjectUser[]> {
    return this.projectUsersRepository.find({ where : { user }});
  }

  findById(id: string): Promise<ProjectUser> {
    return this.projectUsersRepository.findOneBy({ id});
  }

  checkBetweenDates(projectUser: ProjectUser): Promise<ProjectUser[]> {
    return this.projectUsersRepository.find({ where : { startDate: Between(projectUser.startDate, projectUser.endDate), endDate: Between(projectUser.startDate, projectUser.endDate) }});
  }

  create(projectUser: ProjectUser): Promise<ProjectUser> {
    let project = this.projectUsersRepository.create(projectUser);
    return this.projectUsersRepository.save(project);
  }
}
