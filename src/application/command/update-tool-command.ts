import { GithubPort } from '@/domain/github';
import { SystemPort } from '@/domain/system';
import { execSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

export class UpdateToolCommand {
  constructor(
        private readonly systemService: SystemPort,
        private readonly githubService: GithubPort,
  ) {}

  async execute(): Promise<void> {
    const currentVersion = this.githubService.getCurrentVersion();
    const latestVersion = await this.githubService.getLatestVersion();

    if (currentVersion === latestVersion) {
      return console.log('Jumper ya está actualizado 🎉');
    }
    
    const arch = this.systemService.getArch();
    const url = await this.githubService.getAssetUrl('latest', arch);

    if (!url) throw new Error('No se pudo encontrar el asset.');

    const tmpPath = path.join(os.tmpdir(), `jumper-${arch}.tar.gz`);
    await this.githubService.downloadAsset(url, tmpPath);

    execSync(`tar -xzf ${tmpPath} -C ${os.tmpdir()}`);
    const extractedBinary = path.join(os.tmpdir(), 'jumper');


    const currentPath = this.systemService.getExecPath();
    fs.copyFileSync(extractedBinary, currentPath);
    fs.chmodSync(currentPath, 0o755);

    console.log('✅ Jumper actualizado correctamente');
  }
}