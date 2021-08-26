import { BotClient } from '@app/client'
import { MEDIA_QUEUE_FILE_NAME } from '@app/constants'
import {
  getPlexEmbed,
  getPlexMovieEmbedFields,
  getPlexReactionOptions,
  getPlexSeriesEmbedFields,
  sendErrorMessage,
  sendInfoMessage,
  sendSuccessMessage,
} from '@app/helpers'
import { FileService, RadarrService, SonarrService } from '@app/services'
import { MediaType } from '@app/types'
import { Message } from 'discord.js'
import { Command } from '../command'

export default class PlexCommand extends Command {
  radarrService: RadarrService
  sonarrService: SonarrService
  fileService: FileService

  constructor(client: BotClient) {
    super(client, {
      name: 'plex',
      description: `Biður um þætti eða mynd á Plex. 
        Dæmi: !plex Game of Thrones. 
        Fyrir myndir: !plex -m Inception`,
    })

    this.radarrService = new RadarrService(client.config)
    this.sonarrService = new SonarrService(client.config)
    this.fileService = new FileService(MEDIA_QUEUE_FILE_NAME)
  }

  async run(message: Message, args: string[]) {
    const isMovie = this.isMovieRequest(args)

    if (isMovie) {
      const term = args.filter((x) => x !== '-m').join(' ')
      await this.handleMovieRequest(message, term)
      return
    }

    const term = args.join(' ')
    await this.handleSeriesRequest(message, term)
  }

  private async waitForReaction(reply: Message, message: Message) {
    try {
      await reply.react('👍')
      await reply.react('👎')

      const reactions = await reply.awaitReactions(
        getPlexReactionOptions(message),
      )
      const reaction = reactions.first()
      return reaction?.emoji.name === '👍'
    } catch (err) {
      return false
    }
  }

  private isMovieRequest = (terms: string[]) => {
    return terms.includes('-m')
  }

  private handleMovieRequest = async (msg: Message, term: string) => {
    try {
      const results = await this.radarrService.lookUp(term)
      console.log(results.data[0])

      if (!results.data || results.data.length === 0) {
        msg.channel.send(`Fann enga mynd sem heitir ${term}`)
        return
      }

      const movie = results.data[0]
      const embed = getPlexEmbed(movie, getPlexMovieEmbedFields(movie))
      const reply = await msg.channel.send({ embeds: [embed] })
      const shouldAdd = await this.waitForReaction(reply, msg)

      if (!shouldAdd) {
        await sendErrorMessage(msg, `Hætti við að sækja ${movie.title}`)
        return
      }

      await sendInfoMessage(msg, `Reyni að setja ${movie.title} í queue...`)
      const result = await this.radarrService.maybeAddToQueue(movie)

      if (result.success) {
        await this.fileService.addMediaToFile(
          movie,
          msg.author,
          MediaType.MOVIE,
        )
        await sendSuccessMessage(msg, result.message)
      } else {
        await sendErrorMessage(msg, result.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  private handleSeriesRequest = async (msg: Message, term: string) => {
    try {
      const results = await this.sonarrService.lookUp(term)
      console.log(results.data[0])

      if (!results.data || results.data.length === 0) {
        msg.channel.send(`Fann enga þætti sem heita ${term}`)
        return
      }

      const series = results.data[0]
      const embed = getPlexEmbed(series, getPlexSeriesEmbedFields(series))
      const reply = await msg.channel.send({ embeds: [embed] })
      const shouldAdd = await this.waitForReaction(reply, msg)

      if (!shouldAdd) {
        await sendErrorMessage(msg, `Hætti við að sækja ${series.title}`)
        return
      }

      await sendInfoMessage(msg, `Reyni að setja ${series.title} í queue...`)
      const result = await this.sonarrService.maybeAddToQueue(series)

      if (result.success) {
        await this.fileService.addMediaToFile(
          series,
          msg.author,
          MediaType.SERIES,
        )
        await sendSuccessMessage(msg, result.message)
      } else {
        await sendErrorMessage(msg, result.message)
      }
    } catch (err) {
      console.log(err)
    }
  }
}
