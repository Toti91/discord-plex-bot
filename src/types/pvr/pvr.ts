export enum PVRErrorCodes {
  MOVIE_EXISTS = 'MovieExistsValidator',
}

export interface PVRError {
  errorMessage: string
  errorCode: PVRErrorCodes
}
