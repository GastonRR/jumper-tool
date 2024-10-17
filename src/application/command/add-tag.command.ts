import { ProjectService } from '@/application/service/project.service';
import { TagService } from '@/application/service/tag.service';

export class  AddTagCommand{
  private tagService: TagService;
  private projectService: ProjectService;

  constructor(tagService: TagService, projectService: ProjectService) {
    this.tagService = tagService;
    this.projectService = projectService;
  }

  async execute(name?: string, path?: string): Promise<void> {
    const pathFinded = path || process.cwd();

    const project = await this.projectService.find(pathFinded);

    if(project.isTagged) {
      throw new Error('Project already tagged');
    }

    const newTag = {
      name: name || project.name,
      project: project.name,
      targetPath: project.path,
    };

    await this.tagService.createTag(newTag);
  }
}
