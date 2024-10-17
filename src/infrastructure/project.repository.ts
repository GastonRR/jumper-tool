import { existsSync, readdirSync, statSync, promises } from 'fs';
import path from 'path';
import os from 'os';

import { Project, ProjectRepository } from '@/domain/project';
import { Tag } from '@/domain/tag';
import { ProjectError } from '@/domain/error';

export class InMemoryProjectRepository implements ProjectRepository {
  private configFilePath = path.join(os.homedir(), '.config', 'portal', 'config.json');

  public async list(basePath: string): Promise<Project[]> {
    const fixedPath = this.fixPath(basePath);
    const projects: Project[] = [];

    await this.scanDirectory(fixedPath, projects);

    return projects;
  }

  public async find(basePath: string): Promise<Project | null> {
    const fixedPath = this.fixPath(basePath);

    console.log(fixedPath);
    return await this.processDirectory(fixedPath);
  }

  private async scanDirectory(
    directory: string,
    projects: Project[],
  ): Promise<void> {
    const entriesPath = readdirSync(directory);

    for (const entryPath of entriesPath) {
      const fullPath = path.join(directory, entryPath);

      if (entryPath === '.DS_Store') {
        continue;
      }

      const project = await this.processDirectory(fullPath);

      if (project) {
        projects.push(project);
      }
    }
  }

  private async processDirectory(directory: string): Promise<Project | null> {
    try {
      const infoPath = statSync(directory);
   
      let project: Project | null = null;

      if (infoPath.isDirectory() && this.isGitRepository(directory)) {
        const name = await this.getProjectName(directory);
        const isTagged = await this.isTagged(name);

        project = { path: directory, isTagged, name };
      }
      return project;
    } catch (error) {
      throw new ProjectError('repository doesn\'t meet the requirements', 429);
    }
  }

  private async isTagged(name: string): Promise<boolean> {
    const config = await promises.readFile(this.configFilePath, 'utf-8');
    const tags = (await JSON.parse(config)) as Tag[];

    return tags.some((tag) => tag.project === name);
  }

  private async getProjectName(directory: string): Promise<string> {
    const gitPath = path.join(directory, '.git');
    const configPath = path.join(gitPath, 'config');

    const config = await promises.readFile(configPath, 'utf-8');
    const match = config.match(/\[remote "origin"\]\n\s*url = (.*)\n/);

    if (!match) {
      return '';
    }

    const url = match[1];
    const projectNameMatch = url.match(/\/([^/]+)\.git$/);
    const name = projectNameMatch ? projectNameMatch[1] : '';

    return name;
  }

  private isGitRepository(directory: string): boolean {
    return existsSync(path.join(directory, '.git'));
  }

  private fixPath(directory: string): string {
    const isAbsolute = path.isAbsolute(directory);

    if (isAbsolute) {
      return directory;
    }

    directory = path.join(os.homedir(), directory);
    return directory;
  }
}
