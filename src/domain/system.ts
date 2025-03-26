export interface SystemPort {
    getExecPath(): string;
    getArch(): 'x64' | 'arm64';
    isUnix(): boolean;
  }
  