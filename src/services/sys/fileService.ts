import { MediaFile, MediaType, PlexMedia } from '@app/types'
import { User } from 'discord.js'
import { readFile, writeFile } from 'fs/promises'

export class FileService {
  private filename: string

  constructor(filename: string) {
    this.filename = filename
  }

  async addMediaToFile(media: PlexMedia, user: User, mediaType: MediaType) {
    const payload = this.constructMediaPayload(media, user, mediaType)
    const queue = await this.readFile()
    queue.push(payload)
    this.writeFile(queue)
  }

  async writeQueueToFile(queue: MediaFile[]) {
    await this.writeFile(queue)
  }

  async getQueueFromFile() {
    return this.readFile()
  }

  private async readFile(): Promise<MediaFile[]> {
    const raw = await readFile(this.filename)
    return JSON.parse(raw.toString())
  }

  private async writeFile(data: MediaFile[]) {
    return writeFile(this.filename, JSON.stringify(data))
  }

  private constructMediaPayload(
    media: PlexMedia,
    user: User,
    mediaType: MediaType,
  ): MediaFile {
    return {
      title: media.title,
      type: mediaType,
      userMention: user.toString(),
      username: user.username,
      date: new Date().toISOString(),
    }
  }
}
