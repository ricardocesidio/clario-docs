import fs from "fs"
import path from "path"
import { StorageProvider } from "./types"

function getUploadDir() {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads")
}

export class LocalStorageProvider implements StorageProvider {
  async save(fileName: string, buffer: Buffer): Promise<string> {
    const dir = getUploadDir()
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    const filePath = path.join(dir, fileName)
    fs.writeFileSync(filePath, buffer)
    return fileName
  }

  async get(fileName: string): Promise<Buffer> {
    const filePath = path.join(getUploadDir(), fileName)
    return fs.readFileSync(filePath)
  }

  async delete(fileName: string): Promise<void> {
    const filePath = path.join(getUploadDir(), fileName)
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (error) {
      console.error("Failed to delete file:", error)
    }
  }

  getPath(fileName: string): string {
    return path.join(getUploadDir(), fileName)
  }
}
