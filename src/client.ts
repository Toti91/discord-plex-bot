import Discord, { ClientOptions, Collection, TextChannel } from 'discord.js'
import { readdirSync } from 'fs'
import { join, resolve } from 'path/posix'
import { Command } from './commands/command'
import { Task } from './tasks/task'
import { AppConfig } from './types'

export class BotClient extends Discord.Client {
  public prefix: string
  public config: AppConfig
  public commands: Collection<string, Command>
  public tasks: Array<Task>

  constructor(config: AppConfig, options: ClientOptions) {
    super(options)
    this.prefix = config.prefix
    this.config = config
    this.commands = new Collection()
    this.tasks = new Array()
  }

  public getTextChannelById(id: string) {
    return this.channels.cache.get(id) as TextChannel
  }

  public loadEvents(path: string) {
    const files = readdirSync(path).filter(
      (f) => f.endsWith('.js') || f.endsWith('.ts'),
    )
    if (files.length === 0) return console.log('No events')

    for (const file of files) {
      const eventName = file.substring(0, file.indexOf('.'))
      const event = require(resolve(
        join(__dirname, '../build', `${path}/${file.replace('ts', 'js')}`),
      )).default

      super.on(eventName, event.bind(null, this))
    }

    return this
  }

  public loadCommands(path: string) {
    const dirs = readdirSync(path).filter(
      (f) => !f.endsWith('.js') && !f.endsWith('.ts'),
    )

    for (const dir of dirs) {
      const commands = readdirSync(
        resolve(join(__dirname, '../build', `${path}/${dir}`)),
      ).filter((f) => f.endsWith('.js') || f.endsWith('.ts'))
      for (const cmd of commands) {
        const Command = require(resolve(
          join(
            __dirname,
            '../build',
            `${path}/${dir}/${cmd.replace('ts', 'js')}`,
          ),
        )).default
        const command = new Command(this) as Command
        if (command.name) {
          this.commands.set(command.name, command)
        }
      }
    }
    return this
  }

  public loadTasks(path: string) {
    const dirs = readdirSync(path).filter(
      (f) => !f.endsWith('.js') && !f.endsWith('.ts'),
    )

    for (const dir of dirs) {
      const tasks = readdirSync(
        resolve(join(__dirname, '../build', `${path}/${dir}`)),
      ).filter((f) => f.endsWith('.js') || f.endsWith('.ts'))
      for (const t of tasks) {
        const Task = require(resolve(
          join(
            __dirname,
            '../build',
            `${path}/${dir}/${t.replace('ts', 'js')}`,
          ),
        )).default
        const task = new Task(this) as Task
        if (task) {
          this.tasks.push(task)
        }
      }
    }
    return this
  }
}
