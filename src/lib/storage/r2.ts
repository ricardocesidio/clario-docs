import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { StorageProvider } from "./types"

export class R2StorageProvider implements StorageProvider {
  private client: S3Client
  private bucket: string
  private publicUrlBase: string

  constructor() {
    const accountId = process.env.R2_ACCOUNT_ID || ""
    const accessKeyId = process.env.R2_ACCESS_KEY_ID || ""
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || ""
    this.bucket = process.env.R2_BUCKET_NAME || ""
    this.publicUrlBase = process.env.R2_PUBLIC_URL || ""

    if (!accountId || !accessKeyId || !secretAccessKey || !this.bucket) {
      throw new Error(
        "R2 not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME."
      )
    }

    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    })
  }

  async save(fileName: string, buffer: Buffer): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileName,
      Body: buffer,
    })
    await this.client.send(command)
    return fileName
  }

  async get(fileName: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileName,
    })
    const response = await this.client.send(command)
    const bytes = await response.Body?.transformToByteArray()
    return Buffer.from(bytes || [])
  }

  async delete(fileName: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: fileName,
    })
    await this.client.send(command)
  }

  getPath(fileName: string): string {
    if (this.publicUrlBase) {
      return `${this.publicUrlBase}/${fileName}`
    }
    return fileName
  }
}
