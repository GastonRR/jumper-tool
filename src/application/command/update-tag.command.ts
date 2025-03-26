import { TagService } from '@/application/service/tag.service';
import { TagError } from '@/domain/error';

export class UpdateTagCommand {
  private tagService: TagService;

  constructor(tagService: TagService) {
    this.tagService = tagService;
  }

  async execute(project: string, newTag: string): Promise<void> {
    try {
      await this.tagService.updateTag(project, newTag);
      console.log(`Tag of Project: ${project} was updated successfully to ${newTag}`);
    }
    catch (error) {
      if (error instanceof TagError) {
        throw error;
      }
      throw new TagError('Unknown error');
    }
  }
}