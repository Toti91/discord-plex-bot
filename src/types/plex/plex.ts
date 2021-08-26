export interface PlexImage {
  coverType: string
  url: string
}

export interface PlexRating {
  votes: number
  value: number
}

export interface PlexMedia {
  title: string
  sizeOnDisk: number
  status: string
  overview: string
  images: PlexImage[]
  remotePoster: string
  year: number
  profileId: number
  monitured: boolean
  isAvailable: boolean
  runtime: number
  imdbId: string
  genres: string[]
  ratings: PlexRating
  titleSlug: string
}
