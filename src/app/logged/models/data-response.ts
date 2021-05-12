export type DataResponse = {
  photos: PhotoResponse[]
  temperatures: TemperaturesResponse[]
}

export type PhotoResponse = {
  id: number
  name: string
  image: string
  date_taken: string
}

export type TemperaturesResponse = {
  id: number
  temperature1: string
  temperature2: string
}
