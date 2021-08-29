import { BotClient } from '@app/client'
import {
  CANCEL_BTN,
  MEDIA_QUEUE_FILE_NAME,
  REPLY_TIMEOUT,
} from '@app/constants'
import {
  getBotName,
  getButtons,
  getCanceledButton,
  getErrorButton,
  getPlexEmbed,
  getPlexMovieEmbedFields,
  getPlexSeriesEmbedFields,
  getSuccessButton,
  sendErrorMessage,
} from '@app/helpers'
import { FileService, RadarrService, SonarrService } from '@app/services'
import { MediaType } from '@app/types'
import {
  ButtonInteraction,
  GuildMember,
  Interaction,
  Message,
} from 'discord.js'
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
    if (!args || args.length === 0) {
      await sendErrorMessage(message, 'Vantar leitarskilyrði.')
      return
    }

    const isValid = await this.isValidRequest(message)
    if (!isValid) return

    const isMovie = this.isMovieRequest(args)
    const term = this.cleanupTerms(args)

    if (!term) {
      await sendErrorMessage(message, 'Vantar leitarskilyrði.')
      return
    }

    if (isMovie) {
      await this.handleMovieRequest(message, term)
      return
    }

    await this.handleSeriesRequest(message, term)
  }

  private isMovieRequest = (terms: string[]) => {
    return terms.includes('-m')
  }

  private cleanupTerms = (terms: string[]) => {
    return terms.filter((x) => x !== '-m').join(' ')
  }

  private isValidRequest = async (message: Message) => {
    if (!this.isCorrectChannel(message)) {
      const reply = 'Þú þarft að vera á Plex rásinni til að nota þessa skipun.'
      await message.channel.send(reply)
      return false
    }

    if (!this.hasCorrectRole(message.member)) {
      const reply = 'Þú hefur ekki réttindi til að nota þessa skipun.'
      await message.channel.send(reply)
      return false
    }

    return true
  }

  private isCorrectChannel = (message: Message) => {
    const channelId = this.client.config.plex.channelId
    return message.channelId === channelId
  }

  private hasCorrectRole = (member: GuildMember | null) => {
    const roleId = this.client.config.plex.roleId
    return member?.roles.cache.get(roleId) !== undefined
  }

  private isInvalidInteraction = (
    interaction: Interaction,
    reply: Message,
    msg: Message,
  ) => {
    return (
      !interaction.isButton() ||
      interaction.message.id !== reply.id ||
      interaction.user.id !== msg.member?.user.id
    )
  }

  private handleMovieRequest = async (msg: Message, term: string) => {
    try {
      const results = await this.radarrService.lookUp(term)
      let shouldTimeout = true

      if (!results.data || results.data.length === 0) {
        await sendErrorMessage(msg, `Fann enga mynd sem heitir ${term}`)
        return
      }

      const movie = results.data[0]
      const embed = getPlexEmbed(
        movie,
        getBotName(this.client),
        getPlexMovieEmbedFields(movie),
      )
      const row = getButtons()

      const reply = await msg.reply({
        embeds: [embed],
        components: [row],
      })

      setTimeout(async () => {
        if (shouldTimeout) {
          await reply.edit({
            components: [
              getCanceledButton(`Hætti við að sækja ${movie.title}`),
            ],
          })
        }
      }, REPLY_TIMEOUT)

      this.client.on('interactionCreate', async (interaction) => {
        if (this.isInvalidInteraction(interaction, reply, msg)) return
        shouldTimeout = false

        const button = interaction as ButtonInteraction

        if (button.customId === CANCEL_BTN) {
          await button.update({
            components: [
              getCanceledButton(`Hætti við að sækja ${movie.title}`),
            ],
          })
          return
        }

        const result = await this.radarrService.maybeAddToQueue(movie)

        if (result.success) {
          await this.fileService.addMediaToFile(
            movie,
            msg.author,
            MediaType.MOVIE,
          )
          await button.update({
            components: [getSuccessButton(result.message)],
          })
        } else {
          await button.update({
            components: [getErrorButton(result.message)],
          })
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  private handleSeriesRequest = async (msg: Message, term: string) => {
    try {
      const results = await this.sonarrService.lookUp(term)
      let shouldTimeout = true

      if (!results.data || results.data.length === 0) {
        await sendErrorMessage(msg, `Fann enga þætti sem heita ${term}`)
        return
      }

      const series = results.data[0]
      const embed = getPlexEmbed(
        series,
        getBotName(this.client),
        getPlexSeriesEmbedFields(series),
      )
      const row = getButtons()

      const reply = await msg.reply({
        embeds: [embed],
        components: [row],
      })

      setTimeout(async () => {
        if (shouldTimeout) {
          await reply.edit({
            components: [
              getCanceledButton(`Hætti við að sækja ${series.title}`),
            ],
          })
        }
      }, REPLY_TIMEOUT)

      this.client.on('interactionCreate', async (interaction) => {
        if (this.isInvalidInteraction(interaction, reply, msg)) return
        shouldTimeout = false

        const button = interaction as ButtonInteraction

        if (button.customId === CANCEL_BTN) {
          await button.update({
            components: [
              getCanceledButton(`Hætti við að sækja ${series.title}`),
            ],
          })
          return
        }

        const result = await this.sonarrService.maybeAddToQueue(series)

        if (result.success) {
          await this.fileService.addMediaToFile(
            series,
            msg.author,
            MediaType.SERIES,
          )
          await button.update({
            components: [getSuccessButton(result.message)],
          })
        } else {
          await button.update({
            components: [getErrorButton(result.message)],
          })
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
}
