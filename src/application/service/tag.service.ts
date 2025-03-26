import { TagError } from '@/domain/error';
import { Tag, TagRepository } from '@/domain/tag';

export class TagService {
  private tagRepository: TagRepository;

  constructor(tagRepository: TagRepository) {
    this.tagRepository = tagRepository;
  }

  async createTag(tag: Tag): Promise<Tag> {
    try {
      await this.tagRepository.save(tag);
      console.log(`Tag ${tag.name} was created successfully`);
      return tag;
    } catch (error) {
      if (error instanceof TagError) {
        throw error;
      }
      throw new TagError('Unknown error');
    }
  }

  async getTagByName(name: string): Promise<Tag> {
    try {
      const tag = await this.tagRepository.find('name', name);

      if (!tag) {
        throw new TagError('Checkpoint don\'t found', 404);
      }
      return tag;
    } catch (error) {
      if (error instanceof TagError) {
        throw error;
      }
      throw new TagError('Unknown error');
    }
  }

  async deleteTag(project: string): Promise<void> {
    await this.tagRepository.delete(project);
  }

  async updateTag(project: string, tag: string): Promise<void> {
    await this.tagRepository.update(project, tag);
  }

  async listTags(): Promise<Tag[]> {
    return await this.tagRepository.list();
  }
}
