#!/usr/bin/env node

import { Command } from 'commander';
import { InMemoryProjectRepository } from '@/infrastructure/project.repository';
import { ConfigTagRepository } from '@/infrastructure/tag.repository';
import { TagService } from '@/application/service/tag.service';
import { ProjectService } from '@/application/service/project.service';
import { GitHubService } from '@/application/service/github.service';
import { SystemService } from '@/application/service/system.service';
import { CLI } from '@/bin/cli';

const tagRepository = new ConfigTagRepository();
const projectRepository = new InMemoryProjectRepository();


const tagService = new TagService(tagRepository);
const projectService = new ProjectService(projectRepository);
const githubService = new GitHubService();
const systemService = new SystemService();

const cli = new CLI(projectService, tagService, githubService, systemService);

const program = new Command();

program
  .name('jumper')
  .version('0.0.1')
  .description('Jumper is a tool to jump between projects')
  .usage(`[options] [command] 
       jump <tag> to jump to a project
    `);

program
  .command('init')
  .description('Initialize the jumper')
  .action(async () => {
    try {
      await cli.init();
      process.exit(0);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log('Unknown error');
      }
      process.exit(1);
    }
  });

program.command('to <tag>', { hidden: true }).action(async (tag) => {
  try {
    await cli.jumpToProject(tag);
    process.exit(0);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('Unknown error');
    }
    process.exit(1);
  }
});

program
  .command('add <name> [path]')
  .description('Add a new checkpoint')
  .action(async (name, path) => {
    try {
      await cli.addNewTag(name, path);
      process.exit(0);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log('Unknown error');
      }
      process.exit(1);
    }
  });


program
  .command('scan')
  .description('Scan for new projects that are not tagged')
  .action(async () => {
    try {
      await cli.scanProjects();
      process.exit(0);
    } catch (error) {
      console.error('Unhandled error:', error);
      process.exit(1);
    }
  });

program.command('list').description('List all tags').action(async () => {
  try {
    await cli.listTags();
    process.exit(0);
  } catch (error) {
    console.error('Unhandled error:', error);
    process.exit(1);
  }
});

program.command('update').description('Update jumper').action(async () => {
  try {
    await cli.update();
    process.exit(0);
  }
  catch (error) {
    console.error('Unhandled error:', error);
    process.exit(1);
  }
});


program.parse(process.argv);
