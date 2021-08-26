import { BotClient } from '@app/client'
import { CommandOptions } from '@app/types'
import { Message } from 'discord.js'

export class Command {
  protected client: BotClient
  public name: string
  public description: string

  constructor(client: BotClient, options: CommandOptions) {
    this.client = client
    this.name = options.name
    this.description = options.description
  }

  public run(message: Message, args: string[]) {
    throw new Error(`The ${this.name} command has no run() method`)
  }
}
