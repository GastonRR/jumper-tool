import { promises } from 'fs';
import os from 'os';
import path from 'path';
import inquirer from 'inquirer';

import { SHELL_FUNCTION_INIT } from '@/constants/shellFunction';
import { AddTagCommand } from '@/application/command/add-tag.command';
import { ProjectService } from '@/application/service/project.service';
import { TagService } from '@/application/service/tag.service';
import { JumpToProjectCommand } from '@/application/command/jump-project.command';
import { ScanProjectCommand } from '@/application/command/scan-project.command';
import { ListTagCommand } from '@/application/command/list-tags.command';
import { AddMultipleTagsCommand } from '@/application/command/add-multiple-tags.command';


export class CLI {
  private addTagCommand: AddTagCommand;
  private jumpToProjectCommand: JumpToProjectCommand;
  private addMultipleTagsCommand: AddMultipleTagsCommand;
  private scanProjectCommand: ScanProjectCommand;
  private listTagsCommand: ListTagCommand;

  constructor(projectService: ProjectService, tagService: TagService) {
    this.addTagCommand = new AddTagCommand(tagService, projectService);
    this.jumpToProjectCommand = new JumpToProjectCommand(tagService);
    this.addMultipleTagsCommand = new AddMultipleTagsCommand(tagService);
    this.scanProjectCommand = new ScanProjectCommand(projectService);
    this.listTagsCommand = new ListTagCommand(tagService);

  
  }

  public async init(): Promise<void> {
    try {
      const isInitialized = await this.validateIfIsInitialized();

      if (isInitialized) {
        console.log('Jumper was already initialized');
        return;
      }

      const rcFile = await this.getRcFile();

      console.log(`Adding jumper function in ${rcFile}`);

      await promises.appendFile(rcFile, SHELL_FUNCTION_INIT);

      console.log('Jumper was initialized successfully');
    } catch (error) {
      throw new Error('Error al escribir configuración');
    }
  }

  public async addNewTag(name?: string, path?: string): Promise<void> {
    await this.addTagCommand.execute(name, path);
  }

  public async jumpToProject(tag: string): Promise<void> {
    await this.jumpToProjectCommand.execute(tag);
  }

  public async scanProjects(): Promise<void> {
    const projects = await this.scanProjectCommand.execute();
    console.log(`You have ${projects.length} untagged projects`);

    const response = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'tagProjects',
        message: 'Do you want to tag them?',
      },
    ]);

    if (response.tagProjects) {
      await this.addMultipleTagsCommand.execute(projects);
    } else {
      console.log('Scan finished');
    }
  }

  public async listTags(): Promise<void> {
    await this.listTagsCommand.execute();
  }

  private async getRcFile(): Promise<string> {
    const shell = process.env.SHELL;
    if (!shell) {
      throw new Error('Shell not found');
    }

    const shellRcMap: { [key: string]: string } = {
      zsh: '.zshrc',
      bash: '.bashrc',
    };

    for (const [ key, rcFile ] of Object.entries(shellRcMap)) {
      if (shell.includes(key)) {
        return path.join(os.homedir(), rcFile);
      }
    }

    throw new Error('Unsupported shell');
  }

  private async validateIfIsInitialized(): Promise<boolean> {
    const rcFile = await this.getRcFile();
    const rcFileContent = await promises.readFile(rcFile, 'utf-8');

    return rcFileContent.includes('jump()');
  }

}
