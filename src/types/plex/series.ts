import { PlexMedia } from './plex'

export interface PlexSeason {
  seasonNumber: number
  monitored: boolean
}

export interface PlexSeries extends PlexMedia {
  seasonCount: number
  network: string
  tvdbId: number
  seriesType: string
  seasons: PlexSeason[]
}
