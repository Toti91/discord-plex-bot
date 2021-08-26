import { BotClient } from '@app/client'
import { FIVE_SECONDS_IN_MS, MEDIA_QUEUE_FILE_NAME } from '@app/constants'
import { mention } from '@app/helpers'
import { FileService, PlexClientService } from '@app/services'
import { MediaFile, MediaType } from '@app/types'
import { Task } from '../task'

export default class QueueTask extends Task {
  fileService: FileService
  plexService: PlexClientService

  constructor(client: BotClient) {
    super(client)
    this.fileService = new FileService(MEDIA_QUEUE_FILE_NAME)
    this.plexService = new PlexClientService(this.client.config)
  }

  async run() {
    setInterval(this.checker.bind(this), 20000)
  }

  private async checker() {
    let queue = await this.fileService.getQueueFromFile()
    if (queue.length === 0) return

    const found: MediaFile[] = []
    const movies = await this.plexService.getRecentlyAddedMovies()
    const series = await this.plexService.getRecentlyAddedSeries()

    for (const item of queue) {
      if (item.type === MediaType.MOVIE && movies.includes(item.title)) {
        queue = this.removeMediaFromFile(item.title, MediaType.MOVIE, queue)
        found.push(item)
        continue
      }
      if (item.type === MediaType.SERIES && series.includes(item.title)) {
        queue = this.removeMediaFromFile(item.title, MediaType.SERIES, queue)
        found.push(item)
        continue
      }

      this.maybePruneItem(item, queue)
    }

    if (found.length > 0) {
      await this.fileService.writeQueueToFile(queue)
      await this.notifyUsersOfFoundItems(found)
    }
  }

  private async maybePruneItem(item: MediaFile, queue: MediaFile[]) {
    const dateAdded = new Date(item.date)
    const aWeekAgo = new Date()
    aWeekAgo.setDate(aWeekAgo.getDate() - 7)

    if (aWeekAgo.getTime() > dateAdded.getTime()) {
      const removed = this.removeMediaFromFile(item.title, item.type, queue)
      await this.fileService.writeQueueToFile(removed)
      await this.notifyUserOfPrunedItem(item)
    }
  }

  private async notifyUserOfPrunedItem(item: MediaFile) {
    const admin = mention(this.client.config.plex.adminId)
    const channelId = this.client.config.plex.requestChannelId
    const channel = this.client.getTextChannelById(channelId)
    const seriesMsg = `${admin}, ${item.username} bað um þættina ${item.title} fyrir viku, og þeir eru ekki enn komnir á Plex.\n*P.s. ætla að hætta tékka hvort þeir séu komnir.*`
    const movieMsg = `${admin}, ${item.username} bað um myndina ${item.title} fyrir viku, og hún er ekki enn komin á Plex.\n*P.s. ætla að hætta tékka hvort hún sé komin.*`

    await channel.send(item.type === MediaType.MOVIE ? movieMsg : seriesMsg)
  }

  private async notifyUsersOfFoundItems(items: MediaFile[]) {
    for (const item of items) {
      const channelId = this.client.config.plex.channelId
      const channel = this.client.getTextChannelById(channelId)
      const seriesMsg = `${item.userMention}, að minnsta kosti einn þáttur af ${item.title} er kominn á Plex!`
      const movieMsg = `${item.userMention}, myndin ${item.title} er komin á Plex!`

      await channel.send(item.type === MediaType.MOVIE ? movieMsg : seriesMsg)
    }
  }

  private removeMediaFromFile(
    title: string,
    type: MediaType,
    queue: MediaFile[],
  ) {
    console.log(`Removing ${title} from file.`)
    return queue.filter((x) => !(x.title === title && x.type === type))
  }
}
