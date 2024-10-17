import { TagService } from '@/application/service/tag.service';
import { TagError } from '@/domain/error';

export class JumpToProjectCommand {
  constructor(private readonly tagService: TagService) {}
  async execute(tag: string) {
    try {
      const tagFinded = await this.tagService.getTagByName(tag);
      console.log(tagFinded.targetPath);
    } catch (error) {
      if (error instanceof TagError) {
        throw error;
      }
      
      throw new TagError('Unknown error');
    }

  }
}
