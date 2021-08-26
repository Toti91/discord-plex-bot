import { PlexMedia } from './plex'

export interface PlexQuality {
  quality: {
    id: number
    name: string
    resolution: number
  }
}

export interface PlexMovie extends PlexMedia {
  inCinemas: string
  physicalRelease: string
  downloaded: boolean
  hasFile: boolean
  youTubeTrailerId: string
  studio: string
  isAvailable: boolean
  tmdbId: number
  quality: PlexQuality
}
