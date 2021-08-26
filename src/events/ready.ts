import { BotClient } from '@app/client'

export default (client: BotClient) => {
  if (client.user) {
    console.log(`\n${client.user.username} is up and running.`)
    console.log('\nStarting tasks...')
    for (const task of client.tasks) {
      task.run()
    }
    console.log('Ready!\n')
  }
}
