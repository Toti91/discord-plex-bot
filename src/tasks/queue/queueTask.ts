import { BotClient } from '@app/client'
import { FIVE_MINUTES_IN_MS, MEDIA_QUEUE_FILE_NAME } from '@app/constants'
import { mapMediaItemsToRecord, mention } from '@app/helpers'
import { FileService, PlexClientService } from '@app/services'
import { MediaFile, MediaType } from '@app/types'
import { Task } from '../task'

const mediaTypeMapper = {
  [MediaType.MOVIE]: 'myndin',
  [MediaType.SERIES]: 'þættirnir',
}

export default class QueueTask extends Task {
  fileService: FileService
  plexService: PlexClientService

  constructor(client: BotClient) {
    super(client)
    this.fileService = new FileService(MEDIA_QUEUE_FILE_NAME)
    this.plexService = new PlexClientService(this.client.config)
  }

  async run() {
    setInterval(this.checker.bind(this), FIVE_MINUTES_IN_MS)
  }

  private async checker() {
    let queue = await this.fileService.getQueueFromFile()
    if (queue.length === 0) return

    const found: MediaFile[] = []
    const prune: MediaFile[] = []
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

      const toBePruned = await this.maybePruneItem(item, queue)
      if (toBePruned) prune.push(toBePruned)
    }

    if (found.length > 0) {
      await this.fileService.writeQueueToFile(queue)
      await this.notifyUsersOfFoundItems(found)
    }

    if (prune.length > 0) {
      this.notifyAdminOfPrunedItem(prune, queue)
    }
  }

  private async maybePruneItem(item: MediaFile, queue: MediaFile[]) {
    const dateAdded = new Date(item.date)
    const aWeekAgo = new Date()
    aWeekAgo.setDate(aWeekAgo.getDate() - 7)

    if (aWeekAgo.getTime() > dateAdded.getTime()) {
      return item
    }
  }

  private async notifyAdminOfPrunedItem(
    items: MediaFile[],
    queue: MediaFile[],
  ) {
    const admin = mention(this.client.config.plex.adminId)
    const channelId = this.client.config.plex.requestChannelId
    const channel = this.client.getTextChannelById(channelId)
    const format = (x: MediaFile) =>
      `**${x.title}** (${x.type === MediaType.MOVIE ? 'mynd' : 'þættir'})`

    if (items.length > 1) {
      const message = `${admin}, það var óskað eftir þessu efni fyrir viku og það er ekki ennþá komið á Plex: ${items
        .map((x) => format(x))
        .join(', ')}`

      await channel.send(message)
    } else {
      const item = items[0]
      const seriesMsg = `${admin}, ${item.username} bað um þættina **${item.title}** fyrir viku, og þeir eru ekki enn komnir á Plex.\n*P.s. ætla að hætta tékka hvort þeir séu komnir.*`
      const movieMsg = `${admin}, ${item.username} bað um myndina **${item.title}** fyrir viku, og hún er ekki enn komin á Plex.\n*P.s. ætla að hætta tékka hvort hún sé komin.*`

      await channel.send(item.type === MediaType.MOVIE ? movieMsg : seriesMsg)
    }

    let removed = [...queue]
    for (const pruned of items) {
      removed = this.removeMediaFromFile(pruned.title, pruned.type, removed)
    }
    await this.fileService.writeQueueToFile(removed)
  }

  private async notifyUsersOfFoundItems(items: MediaFile[]) {
    const record = mapMediaItemsToRecord(items)
    const channelId = this.client.config.plex.channelId
    const channel = this.client.getTextChannelById(channelId)

    for (const key in record) {
      const items = record[key]
      if (items.length === 2) {
        const item1 = items[0]
        const item2 = items[1]
        const message = `${key}, þetta er komið á Plex: ${
          mediaTypeMapper[item1.type]
        } **${item1.title}** og ${mediaTypeMapper[item2.type]} **${
          item2.title
        }**`

        await channel.send(message)
      } else if (items.length > 2) {
        const message = `${key}, allt þetta dót er komið á Plex: ${items
          .map((x) => `**${x.title}**`)
          .join(', ')}!`

        await channel.send(message)
      } else {
        const item = items[0]
        const seriesMsg = `${key}, að minnsta kosti einn þáttur af **${item.title}** er kominn á Plex!`
        const movieMsg = `${key}, myndin **${item.title}** er komin á Plex!`

        await channel.send(item.type === MediaType.MOVIE ? movieMsg : seriesMsg)
      }
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
