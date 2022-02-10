import { PlexMedia, PlexMovie, PlexSeries, ServerInformation } from '@app/types'
import { EmbedFieldData, MessageEmbed } from 'discord.js'

const TRUENAS_THUMBNAIL =
  'https://www.truenas.com/wp-content/uploads/2020/07/logo-TrueNAS-Core_119b-compressor.png'
const EMBED_THUMBNAIL = 'https://i.redd.it/5czvsiboj9g51.png'
const EMBED_AUTHOR_ICON =
  'https://www.plex.tv/wp-content/uploads/2018/01/pmp-icon-1.png'

const EMPTY_FIELD = { name: '\u200B', value: '\u200B\n\u200B', inline: true }

const padBottom = (content: string | number) => {
  return `${content}\n\u200B`
}

const formatOverview = (overview: string) => {
  if (!overview) return ''
  return overview.length > 200 ? `${overview.slice(0, 200)}...` : `${overview}`
}

const getInfoFields = (information: ServerInformation): EmbedFieldData[] => {
  return [
    { name: 'Útgáfa', value: padBottom(information.version), inline: true },
    EMPTY_FIELD,
    { name: 'Uppitími', value: padBottom(information.uptime), inline: true },
    { name: 'Minni', value: padBottom(information.mem), inline: true },
    EMPTY_FIELD,
    { name: 'Pláss notað', value: padBottom(information.space), inline: true },
  ]
}

export const resolvePlexImage = (media: PlexMedia) => {
  if (media.remotePoster) return media.remotePoster
  else return media.images.shift()?.url ?? ''
}

export const getPlexEmbed = (
  media: PlexMedia,
  author: string,
  fields: EmbedFieldData[],
) => {
  const embed = new MessageEmbed()
  embed.setColor('#e7a50a')
  embed.setTitle(media.title)
  embed.setURL(`https://www.imdb.com/title/${media.imdbId}`)
  embed.setDescription(padBottom(formatOverview(media.overview)))
  embed.setImage(resolvePlexImage(media))
  embed.setAuthor(author, EMBED_AUTHOR_ICON)
  embed.setThumbnail(EMBED_THUMBNAIL)
  embed.setFields(fields)
  embed.setTimestamp()
  return embed
}

export const getInfoEmbed = (info: ServerInformation, author: string) => {
  const embed = new MessageEmbed()
  embed.setColor('#107ab0')
  embed.setTitle('Plex Info')
  embed.setDescription(padBottom('Upplýsingar um serverinn.'))
  embed.setAuthor(author, EMBED_AUTHOR_ICON)
  embed.setThumbnail(TRUENAS_THUMBNAIL)
  embed.setFields(getInfoFields(info))
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
