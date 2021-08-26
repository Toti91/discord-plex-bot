import { Message } from 'discord.js'
import { BotClient } from '../client'

export default (client: BotClient, message: Message) => {
  if (message.author.bot) return
  const prefixRegex = new RegExp(
    `^(<@!?${client.user?.id}>|${client.prefix.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    )})\\s*`,
  )

  if (prefixRegex.test(message.content)) {
    const [, match] = message.content.match(prefixRegex) ?? []
    const args = message.content
      .slice(match.length)
      .trim()
      .toLowerCase()
      .split(/ +/g)
    const cmd = args.shift()?.toLowerCase() ?? ''
    const command = client.commands.get(cmd)

    if (command) {
      return command.run(message, args)
    }
  }
}
