export interface Tag {
  name: string;
  targetPath: string;
  project: string;
}

export type TagKeys = keyof Tag;

export interface TagRepository {
  save: (tag: Tag) => Promise<void>;
  find: (key: TagKeys, value: string) => Promise<Tag | null>;
  delete: (name: string) => Promise<void>;
  update: (project: string, tag: string) => Promise<void>;
  list: () => Promise<Tag[]>;
}
