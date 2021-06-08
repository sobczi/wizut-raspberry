import { PhotoTemperature } from '@logged/models/photo-temperature'

export type LoggedStore = {
  photosTemperatures: PhotoTemperature[]
  loadingState: boolean
  datesUsed: { dateFrom: Date; dateTo: Date }[]
}

export const LoggedStoreKey = 'LoggedStoreKey'
