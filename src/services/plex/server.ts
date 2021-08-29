import { formatBytes, secondsToDays } from '@app/helpers'
import {
  AppConfig,
  DiskPool,
  PlexConfig,
  ServerInformation,
  ServerInformationData,
} from '@app/types'
import axios, { AxiosInstance } from 'axios'

export class ServerService {
  private config: PlexConfig
  private api: AxiosInstance

  constructor(config: AppConfig) {
    this.config = config.plex
    this.api = axios.create({
      baseURL: `http://${this.config.baseUrl}:${this.config.trueNasPort}/${this.config.trueNasUrl}`,
      timeout: 15000,
      headers: {
        Authorization: this.config.trueNasToken,
        'Content-Type': 'application/json',
      },
    })
  }

  async getServerInformation(): Promise<ServerInformation> {
    const { data: info } = await this.getInformation()
    const { data: pool } = await this.getDiskPool()
    let size = 0
    let allocated = 0

    for (const p of pool) {
      for (const disk of p.topology.data) {
        size += disk.stats.size
        allocated += disk.stats.allocated
      }
    }

    const space = `**${formatBytes(allocated)}** af **${formatBytes(size)}**`

    return {
      cpu: info.model,
      mem: formatBytes(info.physmem),
      version: info.version,
      uptime: secondsToDays(info.uptime_seconds),
      space,
    }
  }

  private getInformation() {
    return this.api.get<ServerInformationData>('system/info')
  }

  private getDiskPool() {
    return this.api.get<DiskPool[]>('pool')
  }
}
