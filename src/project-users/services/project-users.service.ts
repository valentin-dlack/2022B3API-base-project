import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { Project } from "../../projects/project.entity";
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

  findMyProjects(user: User): Promise<ProjectUser[]> {
    return this.projectUsersRepository.find({ where: { user } });
  }

  isInProject(user: User, project: Project): Promise<ProjectUser> {
    return this.projectUsersRepository.findOneBy({ user, project });
  }

  checkBetweenDates(projectUser: ProjectUser): Promise<ProjectUser[]> {
    return this.projectUsersRepository.find({ where : { startDate: Between(projectUser.startDate, projectUser.endDate), endDate: Between(projectUser.startDate, projectUser.endDate) }});
  }

  findByDateAndUser(date: Date, user: User): Promise<ProjectUser[]> {
    return this.projectUsersRepository.find({ where : [{ startDate: Between(date, date) }, { endDate: Between(date, date)}]});
  }

  create(projectUser: ProjectUser): Promise<ProjectUser> {
    let project = this.projectUsersRepository.create(projectUser);
    return this.projectUsersRepository.save(project);
  }
}
