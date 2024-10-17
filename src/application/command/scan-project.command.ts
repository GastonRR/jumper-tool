import { ProjectService } from '@/application/service/project.service';
import { Project } from '@/domain/project';

export class ScanProjectCommand {
  private projectService: ProjectService;

  constructor(projectHandler: ProjectService) {
    this.projectService = projectHandler;
  }

  async execute(path?: string): Promise<Project[]> {
    const pathFinded = path || process.cwd();

    const projects = await this.projectService.listProjects(pathFinded);
    const untaggedProjects = projects.filter((project) => !project.isTagged);

    return untaggedProjects;
  }
}
