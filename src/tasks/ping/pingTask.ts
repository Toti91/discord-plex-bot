import { BotClient } from '@app/client'
import {
  FIVE_SECONDS_IN_MS,
  SETTINGS_FILE_NAME,
  THIRTY_MINUTES_IN_MS,
} from '@app/constants'
import { FileService } from '@app/services'
import { Task } from '../task'
import { Socket } from 'net'
import { PlexConfig, Settings } from '@app/types'
import { mention } from '@app/helpers'

export default class PingTask extends Task {
  private fileService: FileService
  private ports: Array<number>

  constructor(client: BotClient) {
    super(client)
    this.fileService = new FileService(SETTINGS_FILE_NAME)
    this.ports = this.getPorts(this.client.config.plex)
  }

  async run() {
    this.checker()
    setInterval(this.checker.bind(this), THIRTY_MINUTES_IN_MS)
  }

  private async checker() {
    try {
      const settings = await this.fileService.getDataFromFile<Settings>()
      if (!settings.shouldPing) return

      const found: string[] = []

      for (const port of this.ports) {
        const sock = new Socket()
        sock.setTimeout(FIVE_SECONDS_IN_MS)

        sock
          .on('connect', () => {
            sock.destroy()
          })
          .on('error', () => {
            found.push(`**${port}**`)
          })
          .on('timeout', () => {
            found.push(`**${port}**`)
          })
          .connect(port, this.client.config.plex.baseUrl)
      }

      if (found.length > 0) {
        console.log('Some ports are down')
        const admin = mention(this.client.config.plex.adminId)
        const channelId = this.client.config.plex.channelId
        const channel = this.client.getTextChannelById(channelId)
        const message =
          found.length === 1
            ? `port ${found[0]} er niðri.`
            : `port ${
                found.length === 2 ? found.join('og ') : found.join(', ')
              } eru niðri.`

        await channel.send(`${admin}, ${message}`)
        return
      }
    } catch (error) {
      console.log(error)
    }
  }

  private getPorts(config: PlexConfig) {
    return [
      config.clientPort,
      config.trueNasPort,
      config.radarrPort,
      config.sonarrPort,
    ]
  }
}
