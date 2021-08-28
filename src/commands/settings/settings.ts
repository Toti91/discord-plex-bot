import { BotClient } from '@app/client'
import { SETTINGS_FILE_NAME } from '@app/constants'
import { settingsMenuHandler } from '@app/handlers'
import { getSettingsMenu } from '@app/helpers'
import { FileService } from '@app/services'
import { Settings } from '@app/types'
import { Message } from 'discord.js'
import { Command } from '../command'

export default class SettingsCommand extends Command {
  private fileService: FileService

  constructor(client: BotClient) {
    super(client, {
      name: 'stillingar',
      description: `Plex stillingar`,
    })

    this.fileService = new FileService(SETTINGS_FILE_NAME)
  }

  async run(message: Message, args: string[]) {
    const settings = await this.fileService.getDataFromFile<Settings>()

    const row = getSettingsMenu(settings.shouldPing)

    await message.reply({
      content: `Hæ, velkomin/n í BETA útgáfu af stillingum! 🛠\n`,
      components: [row],
      isInteraction: true,
    })

    this.client.on('interactionCreate', (interaction) =>
      settingsMenuHandler(interaction, this.fileService, message.channel),
    )
  }
}
