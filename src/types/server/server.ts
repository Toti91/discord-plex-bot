export interface ServerInformationData {
  model: string
  physmem: number
  version: string
  uptime_seconds: number
}

export interface PoolData {
  stats: { size: number; allocated: number }
}

export interface DiskPool {
  topology: {
    data: PoolData[]
  }
}

export interface ServerInformation {
  cpu: string
  mem: string
  version: string
  uptime: string
  space: string
}
