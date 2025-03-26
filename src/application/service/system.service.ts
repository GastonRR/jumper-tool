import os from 'os';
import process from 'process';
import { SystemPort } from '@/domain/system';

export class SystemService implements SystemPort {
  getExecPath(): string {
    return process.execPath;
  }

  getArch(): 'x64' | 'arm64' {
    const arch = os.arch();
    return arch === 'arm64' ? 'arm64' : 'x64';
  }

  isUnix(): boolean {
    return process.platform !== 'win32';
  }
}
