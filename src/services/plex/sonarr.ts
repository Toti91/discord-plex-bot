import { ROOT_FOLDER_PATH, SONARR_ADD_OPTIONS } from '@app/constants'
import { AppConfig, PlexConfig, PlexSeries, PVRError } from '@app/types'
import axios, { AxiosError, AxiosInstance } from 'axios'

export class SonarrService {
  private config: PlexConfig
  private api: AxiosInstance

  constructor(config: AppConfig) {
    this.config = config.plex
    this.api = axios.create({
      baseURL: `http://${this.config.baseUrl}:${this.config.sonarrPort}/api`,
      timeout: 15000,
      params: { apiKey: this.config.sonarrToken },
    })
  }

  async lookUp(query: string) {
    return this.api.get<PlexSeries[]>('series/lookup', {
      params: { term: query },
    })
  }

  async maybeAddToQueue(media: PlexSeries) {
    const payload = this.constructPayload(media)

    try {
      await this.api.post('series', payload)
      return { success: true, message: `Tókst að bæta við ${media.title}!` }
    } catch (error) {
      const axiosError = error as AxiosError
      const pvrError = axiosError.response?.data[0] as PVRError

      // This check is dirty but Sonarr API doesn't return errorCode like Radarr does
      if (pvrError && pvrError.errorMessage.includes('already been added'))
        return { success: false, message: `${media.title} er nú þegar á Plex.` }

      return { success: false, message: axiosError.message }
    }
  }

  private constructPayload(series: PlexSeries) {
    return {
      tvdbId: series.tvdbId,
      title: series.title,
      seasons: series.seasons,
      profileId: this.assignProfileId(series.year, series.seasonCount),
      titleSlug: series.titleSlug,
      images: series.images,
      year: series.year,
      rootFolderPath: ROOT_FOLDER_PATH,
      addOptions: SONARR_ADD_OPTIONS,
    }
  }

  private assignProfileId(year: number, seriesCount: number) {
    /* 
      Assigns quality profile id based on year and number of series.
      We don't want to fill the hard drive with a bunch of 4K quality series,
      so older series get worse quality.
    */

    if (year > 2015) return 6
    else if (year > 2009 && year <= 2015 && seriesCount > 3) return 3
    else if (year <= 2009 && seriesCount > 3) return 2
    else return 3
  }
}
