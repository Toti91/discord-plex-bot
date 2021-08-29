import { BotClient } from '@app/client'
import { getInfoEmbed } from '@app/helpers'
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
    const information = await this.serverService.getServerInformation()
    const embed = getInfoEmbed(information)
    await message.channel.send({ embeds: [embed] })
  }
}
