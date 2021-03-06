import { BotClient } from '@app/client'
import { MessageActionRow, MessageButton } from 'discord.js'

export default (client: BotClient) => {
  if (client.user) {
    console.log(`\n${client.user.username} is up and running.`)
    console.log('\nStarting tasks...')
    for (const task of client.tasks) {
      task.run()
    }
    console.log('Ready!\n')
    // console.log(client.guilds.cache.first()?.emojis.cache)
  }
}
