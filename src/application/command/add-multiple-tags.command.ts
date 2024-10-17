import inquirer from 'inquirer';

import { Project } from '@/domain/project';
import { TagService } from '@/application/service/tag.service';

export class  AddMultipleTagsCommand{
  private tagService: TagService;

  constructor(tagService: TagService) {
    this.tagService = tagService;
  }

  async execute(projects: Project[]): Promise<void> {
    
    for (const project of projects) {
      const response = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'tag',
          message: `Do you want to tag ${project.name}? or press n to skip`,
        },
      ]);
  
      if (!response.tag) {
        continue;
      }
  
      const responseName = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter the tag name',
          default: project.name,
        },
      ]);
  

      const newTag = {
        name: responseName.name,
        project: project.name,
        targetPath: project.path,
      };
  
      await this.tagService.createTag(newTag);
     
    }
  }
}
