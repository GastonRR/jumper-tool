import fs from 'fs';
import https from 'https';
import { GithubPort } from '@/domain/github';
import { CURRENT_VERSION } from '@/utils';

export class GitHubService implements GithubPort {
  constructor(private repo: string = 'GastonRR/jumper-tool') {}

  async getAssetUrl(tag: string, arch: string): Promise<string> {
    const assetName = `jumper-${arch}.tar.gz`;
    const apiUrl = `https://api.github.com/repos/${this.repo}/releases/${tag}`;

    return new Promise((resolve) => {
      const req = https.request(apiUrl, {
        headers: { 'User-Agent': 'jumper-updater' },
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            const asset = json.assets.find((a: any) => a.name === assetName);
            resolve(asset?.browser_download_url || '');
          } catch {
            resolve('');
          }
        });
      });

      req.on('error', () => resolve(''));
      req.end();
    });
  }

  async downloadAsset(url: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dest);
      https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    });
  }

  async getLatestVersion(): Promise<string> {
    const apiUrl = `https://api.github.com/repos/${this.repo}/releases/latest`;

    return new Promise((resolve) => {
      https.get(apiUrl, { headers: { 'User-Agent': 'jumper' } }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json.tag_name?.replace(/^v/, '') || '0.0.0');
          } catch {
            resolve('0.0.0');
          }
        });
      }).on('error', () => resolve('0.0.0'));
    });
  }

  getCurrentVersion(): string {
    return CURRENT_VERSION;
  }
}
