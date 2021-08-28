import { ADD_BTN, CANCEL_BTN } from '@app/constants'
import { PlexMedia, PlexMovie, PlexSeries } from '@app/types'
import {
  EmbedFieldData,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageReaction,
  User,
} from 'discord.js'
import { formatBytes } from './numberHelpers'

const EMBED_THUMBNAIL = 'https://i.redd.it/5czvsiboj9g51.png'
const EMBED_AUTHOR_ICON =
  'https://www.plex.tv/wp-content/uploads/2018/01/pmp-icon-1.png'

const EMPTY_FIELD = { name: '\u200B', value: '\u200B\n\u200B', inline: true }

const plexReactionFilter = (
  reaction: MessageReaction,
  user: User,
  message: Message,
) => {
  return (
    (reaction.emoji.name === '👍' || reaction.emoji.name === '👎') &&
    user.id === message.author.id
  )
}

const padBottom = (content: string | number) => {
  return `${content}\n\u200B`
}

const formatOverview = (overview: string) =>
  overview.length > 200 ? `${overview.slice(0, 200)}...` : `${overview}`

export const mention = (id: string) => {
  return `<@${id}>`
}

export const resolvePlexImage = (media: PlexMedia) => {
  if (media.remotePoster) return media.remotePoster
  else return media.images.shift()?.url ?? ''
}

export const getButtons = ({ disabled } = { disabled: false }) => {
  const addBtn = new MessageButton()
    .setCustomId(ADD_BTN)
    .setLabel('Bæta við')
    .setStyle('PRIMARY')

  const cancelButton = new MessageButton()
    .setCustomId(CANCEL_BTN)
    .setLabel('Hætta við')
    .setStyle('SECONDARY')

  if (disabled) {
    addBtn.setDisabled()
    cancelButton.setDisabled()
  }

  return new MessageActionRow().addComponents(addBtn, cancelButton)
}

export const getCanceledButton = (text: string) => {
  return new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(CANCEL_BTN)
      .setLabel(text)
      .setStyle('SECONDARY')
      .setDisabled(),
  )
}

export const getSuccessButton = (text: string) => {
  return new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(ADD_BTN)
      .setLabel(text)
      .setStyle('SUCCESS')
      .setDisabled(),
  )
}

export const getErrorButton = (text: string) => {
  return new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(CANCEL_BTN)
      .setLabel(text)
      .setStyle('DANGER')
      .setDisabled(),
  )
}

export const getPlexEmbed = (media: PlexMedia, fields: EmbedFieldData[]) => {
  const embed = new MessageEmbed()
  embed.setColor('#e7a50a')
  embed.setTitle(media.title)
  embed.setURL(`https://www.imdb.com/title/${media.imdbId}`)
  embed.setDescription(padBottom(formatOverview(media.overview)))
  embed.setImage(resolvePlexImage(media))
  embed.setAuthor('Plexarinn', EMBED_AUTHOR_ICON)
  embed.setThumbnail(EMBED_THUMBNAIL)
  embed.setFields(fields)
  embed.setTimestamp()
  return embed
}

export const getPlexMovieEmbedFields = (movie: PlexMovie): EmbedFieldData[] => {
  const rating = movie.ratings?.value?.toString() ?? 'Vantar'
  const runtime = `${movie.runtime} min`
  const trailerUrl = `[Youtube](https://www.youtube.com/watch?v=${movie.youTubeTrailerId})`

  return [
    { name: 'Ár', value: padBottom(movie.year), inline: true },
    { name: 'Einkunn', value: padBottom(rating), inline: true },
    { name: 'Lengd', value: padBottom(runtime), inline: true },
    { name: 'Framleiðandi', value: padBottom(movie.studio), inline: true },
    { name: 'Trailer', value: padBottom(trailerUrl), inline: true },
    EMPTY_FIELD,
  ]
}

export const getPlexSeriesEmbedFields = (
  series: PlexSeries,
): EmbedFieldData[] => {
  const rating = series.ratings?.value?.toString() ?? 'Vantar'
  const runtime = `${series.runtime} min`

  return [
    { name: 'Seríur', value: padBottom(series.seasonCount), inline: true },
    { name: 'Ár', value: padBottom(series.year), inline: true },
    { name: 'Einkunn', value: padBottom(rating), inline: true },
    { name: 'Lengd þátta', value: padBottom(runtime), inline: true },
    { name: 'Veita', value: padBottom(series.network), inline: true },
    EMPTY_FIELD,
  ]
}

export const getPlexReactionOptions = (message: Message) => {
  return {
    filter: (reaction: MessageReaction, user: User) =>
      plexReactionFilter(reaction, user, message),
    max: 1,
    time: 15000,
    errors: ['time'],
    maxUsers: 1,
    maxEmojis: 1,
  }
}
