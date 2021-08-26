declare module 'plex-api' {
  export default class PlexServer {
    constructor(data: string | { hostname: string; token: string })

    async query(url: string): Promise<any>
    async find(options: { uri: string; type: string }): Promise<any>
  }
}
