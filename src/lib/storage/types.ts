export interface StorageProvider {
  save(fileName: string, buffer: Buffer): Promise<string>
  get(fileName: string): Promise<Buffer>
  delete(fileName: string): Promise<void>
  getPath(fileName: string): string
}
