import { BotClient } from '@app/client'
import { getBotName, getInfoEmbed } from '@app/helpers'
import { ServerService } from '@app/services'
import { Message } from 'discord.js'
import { Command } from '../command'

export default class PlexInfoCommand extends Command {
  private serverService: ServerService

  constructor(client: BotClient) {
    super(client, {
      name: 'plexinfo',
      description: `Upplýsingar um serverinn.`,
    })

    this.serverService = new ServerService(this.client.config)
  }

  async run(message: Message) {
    try {
      const information = await this.serverService.getServerInformation()
      const embed = getInfoEmbed(information, getBotName(this.client))
      await message.channel.send({ embeds: [embed] })
    } catch (error) {
      console.log(error)
    }
  }
}
