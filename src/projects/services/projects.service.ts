import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../users/user.entity";
import { Project } from "../project.entity";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  findAll(): Promise<Project[]> {
    return this.projectsRepository.find();
  }

  findMyProjects(user: User): Promise<Project[]> {
    return this.projectsRepository.find({ where: { referringEmployeeId: user.id } });
  }

  findById(id: string): Promise<Project> {
    return this.projectsRepository.findOneBy({ id});
  }

  create(project: Project): Promise<Project> {
    return this.projectsRepository.save(project);
  }
}
