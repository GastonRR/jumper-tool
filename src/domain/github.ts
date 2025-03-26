

export interface GithubPort{
    getAssetUrl(tag: string, arch: string): Promise<string>;
    downloadAsset(url: string, outputPath: string): Promise<void> 
    getLatestVersion(): Promise<string>
    getCurrentVersion(): string
}