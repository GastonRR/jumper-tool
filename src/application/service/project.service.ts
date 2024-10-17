import { Project, ProjectRepository } from '@/domain/project';
import { ProjectError } from '@/domain/error';

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor(projectRepository: ProjectRepository) {
    this.projectRepository = projectRepository;
  }

  public listProjects(path: string): Promise<Project[]> {
    return this.projectRepository.list(path);
  }

  public async find(project: string): Promise<Project> {
    try {
      const projectFound = await this.projectRepository.find(project);

      if (!projectFound) {
        throw new ProjectError('Project not found', 404);
      }

      console.log(`Project found: ${projectFound.name}`);

      return projectFound;
    } catch (error) {
      if (error instanceof ProjectError) {
        throw error;
      }

      throw new ProjectError('Unknown error');
    }
  }
}
