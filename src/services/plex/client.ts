import { AppConfig, PlexConfig } from '@app/types'
import PlexServer from 'plex-api'

const MAX_RESULTS = 20

export class PlexClientService {
  private config: PlexConfig
  private api: PlexServer

  constructor(config: AppConfig) {
    this.config = config.plex
    this.api = new PlexServer({
      hostname: this.config.clientUrl,
      token: this.config.clientToken,
    })
  }

  async getRecentlyAddedMovies() {
    return this.api
      .query(`/library/sections/${this.config.movieFolderKey}/recentlyAdded`)
      .then((result) => {
        const results = result.MediaContainer.Metadata as { title: string }[]
        return results.slice(0, MAX_RESULTS).map((x) => x.title)
      })
  }

  async getRecentlyAddedSeries() {
    return this.api
      .query(`/library/sections/${this.config.seriesFolderKey}/recentlyAdded`)
      .then((result) => {
        const results = result.MediaContainer.Metadata as { title: string }[]
        return results.slice(0, MAX_RESULTS).map((x) => x.title)
      })
  }
}
