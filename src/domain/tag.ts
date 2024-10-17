export interface Tag {
  name: string;
  targetPath: string;
  project: string;
}

export type TagKeys = keyof Tag;

export type TagUpdate = Pick<Tag, 'name' | 'targetPath'>;

export interface TagRepository {
  save: (tag: Tag) => Promise<void>;
  find: (key: TagKeys, value: string) => Promise<Tag | null>;
  delete: (name: string) => Promise<void>;
  update: (project: string, tag: TagUpdate) => Promise<void>;
  list: () => Promise<Tag[]>;
}
