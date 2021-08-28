import { BotClient } from '@app/client'
import { Message } from 'discord.js'
import { Command } from '../command'

export default class TestCommand extends Command {
  constructor(client: BotClient) {
    super(client, {
      name: 'test',
      description: 'test',
    })
  }

  async run(message: Message) {
    message.channel.send('Hello World!')
  }
}
