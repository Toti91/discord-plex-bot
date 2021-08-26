export interface PlexConfig {
  adminId: string
  roleId: string
  channelId: string
  requestChannelId: string
  clientUrl: string
  clientToken: string
  clientPort: number
  trueNasUrl: string
  trueNasToken: string
  radarrToken: string
  radarrUrl: string
  sonarrToken: string
  sonarrUrl: string
  movieFolderKey: string
  seriesFolderKey: string
}

export interface AppConfig {
  prefix: string
  token: string
  ownerId: string
  plex: PlexConfig
}
