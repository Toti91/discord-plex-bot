export interface PlexConfig {
  adminId: string
  roleId: string
  channelId: string
  requestChannelId: string
  baseUrl: string
  clientPort: number
  clientToken: string
  trueNasUrl: string
  trueNasToken: string
  trueNasPort: number
  radarrToken: string
  radarrPort: number
  sonarrToken: string
  sonarrPort: number
  movieFolderKey: string
  seriesFolderKey: string
}

export interface AppConfig {
  prefix: string
  token: string
  ownerId: string
  plex: PlexConfig
}
