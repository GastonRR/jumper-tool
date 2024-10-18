import { existsSync, promises } from 'fs';
import path from 'path';
import os from 'os';
import { Tag, TagKeys, TagRepository, TagUpdate } from '@/domain/tag';
import { TagError } from '@/domain/error';

export class ConfigTagRepository implements TagRepository {
  private configFilePath = path.join(os.homedir(), '.config', 'portal', 'config.json');

  constructor() {
    this.init();
  }

  async init() {
    const configDir = path.dirname(this.configFilePath);

    if (!existsSync(configDir)) {
      await promises.mkdir(configDir, { recursive: true });
      console.log(`Creating config directory at ${configDir}`);
    }

    if (!existsSync(this.configFilePath)) {
      console.log('Creating config file');
      await promises.writeFile(this.configFilePath, JSON.stringify([]));
    }
  }

  async save(tag: Tag): Promise<void> {
    const tags = await this.list();

    const tagExists = tags.find(
      (t) => t.name === tag.name || t.project === tag.project,
    );

    if (tagExists) {
      throw new TagError('Tag already exists', 409);
    }

    const newTags = [ ...tags, tag ];
    await promises.writeFile(this.configFilePath, JSON.stringify(newTags));
  }

  async find(key: TagKeys, project: string): Promise<Tag | null> {
    const tags = await this.list();

    const tag = tags.find((t) => t[key] === project);

    return tag || null;
  }

  async delete(project: string): Promise<void> {
    const tags = await this.list();

    const newTags = tags.filter((t) => t.project !== project);

    await promises.writeFile(this.configFilePath, JSON.stringify(newTags));
  }

  async update(project: string, tag: TagUpdate): Promise<void> {
    const tags = await this.list();

    const tagIndex = tags.findIndex((t) => t.project === project);

    if (tagIndex === -1) {
      throw new TagError('Tag not found', 404);
    }

    const newTags = [
      ...tags.slice(0, tagIndex),
      { ...tags[tagIndex], ...tag },
      ...tags.slice(tagIndex + 1),
    ];

    await promises.writeFile(this.configFilePath, JSON.stringify(newTags));
  }

  async list(): Promise<Tag[]> {
    const fileRead = await promises.readFile(this.configFilePath, 'utf-8');
    const tags = JSON.parse(fileRead) as Tag[];
    return tags;
  }
}
