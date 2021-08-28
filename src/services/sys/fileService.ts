import { MediaFile, MediaType, PlexMedia, Queue, Settings } from '@app/types'
import { User } from 'discord.js'
import { readFile, writeFile } from 'fs/promises'

export class FileService {
  private filename: string

  constructor(filename: string) {
    this.filename = filename
  }

  async addMediaToFile(media: PlexMedia, user: User, mediaType: MediaType) {
    const payload = this.constructMediaPayload(media, user, mediaType)
    const queue = await this.readFile<Queue>()
    queue.push(payload)
    this.writeFile(queue)
  }

  async writeQueueToFile(queue: Queue) {
    await this.writeFile(queue)
  }

  async writeSettingsToFile(settings: Settings) {
    await this.writeFile(settings)
  }

  async getDataFromFile<T>() {
    return this.readFile<T>()
  }

  private async readFile<T>(): Promise<T> {
    const raw = await readFile(this.filename)
    return JSON.parse(raw.toString())
  }

  private async writeFile(data: any) {
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
