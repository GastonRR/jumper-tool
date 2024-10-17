export interface Project {
  name: string;
  path: string;
  isTagged: boolean;
}

export interface ProjectRepository {
  find: (path: string) => Promise<Project | null>;
  list: (path: string) => Promise<Project[]>;
}
