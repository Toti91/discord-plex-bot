import {
  RADARR_ADD_OPTIONS,
  RADARR_QUALITY_PROFILE_ID,
  ROOT_FOLDER_PATH,
} from '@app/constants'
import {
  AppConfig,
  PlexConfig,
  PlexMovie,
  PVRError,
  PVRErrorCodes,
} from '@app/types'
import axios, { AxiosError, AxiosInstance } from 'axios'

export class RadarrService {
  private config: PlexConfig
  private api: AxiosInstance

  constructor(config: AppConfig) {
    this.config = config.plex
    this.api = axios.create({
      baseURL: this.config.radarrUrl,
      timeout: 15000,
      params: { apiKey: this.config.radarrToken },
    })
  }

  async lookUp(query: string) {
    return this.api.get<PlexMovie[]>('movie/lookup', {
      params: { term: query },
    })
  }

  async maybeAddToQueue(media: PlexMovie) {
    const payload = this.constructPayload(media)

    try {
      await this.api.post('movie', payload)
      return { success: true, message: `Tókst að bæta við ${media.title}!` }
    } catch (error) {
      const axiosError = error as AxiosError
      const pvrError = axiosError.response?.data[0] as PVRError

      if (pvrError && pvrError.errorCode === PVRErrorCodes.MOVIE_EXISTS)
        return { success: false, message: `${media.title} er nú þegar á Plex.` }

      return { success: false, message: axiosError.message }
    }
  }

  private constructPayload(movie: PlexMovie) {
    return {
      tmdbId: movie.tmdbId,
      title: movie.title,
      profileId: RADARR_QUALITY_PROFILE_ID,
      qualityProfileId: RADARR_QUALITY_PROFILE_ID,
      titleSlug: movie.titleSlug,
      images: movie.images,
      year: movie.year,
      rootFolderPath: ROOT_FOLDER_PATH,
      addOptions: RADARR_ADD_OPTIONS,
    }
  }
}
