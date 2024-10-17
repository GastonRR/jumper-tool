import { TagService } from '../service/tag.service';

export class  ListTagCommand{
  private tagService: TagService;

  constructor(tagService: TagService) {
    this.tagService = tagService;
  }

  async execute(): Promise<void> {
    
    const tags = await this.tagService.listTags();

    tags.forEach((tag) => {
      console.log(`Tag: ${tag.name} - ${tag.project}`);
    });
  }
}
