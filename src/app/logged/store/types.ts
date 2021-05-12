import { PhotoTemperature } from '@logged/models/photo-temperature'

export type LoggedStore = {
  photosTemperatures: PhotoTemperature[]
  loadingState: boolean
}

export const LoggedStoreKey = 'LoggedStoreKey'
