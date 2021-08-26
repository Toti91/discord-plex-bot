import { Intents } from 'discord.js'
import { BotClient } from './client'
import config from './config.json'

const intents = new Intents()

intents.add(
  'GUILD_PRESENCES',
  'GUILD_MEMBERS',
  'GUILDS',
  'GUILD_VOICE_STATES',
  'GUILD_MESSAGES',
  'GUILD_MESSAGE_REACTIONS',
)

const client = new BotClient(config, { intents })

const init = async () => {
  client.loadEvents('./src/events')
  client.loadCommands('./src/commands')
  client.loadTasks('./src/tasks')
  await client.login(config.token)
}

init()
