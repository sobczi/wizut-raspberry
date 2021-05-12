import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env/environment'
import { DataResponse } from '@logged/models/data-response'
import { PhotoTemperature } from '@logged/models/photo-temperature'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class LoggedService {
  constructor (private readonly http: HttpClient) {}

  fetchImages (): Observable<PhotoTemperature[]> {
    return this.http.get<DataResponse>(environment.data).pipe(
      map(response =>
        response.photos.map(photo => {
          const foundTemperature = response.temperatures.find(
            t => t.id === photo.id
          )
          return {
            id: photo.id,
            imageName: photo.name,
            imageUrl: `${environment.imageAccess}${photo.image}`,
            imageDate: new Date(photo.date_taken),
            firstTemperature: Number(foundTemperature.temperature1),
            secondTemperature: Number(foundTemperature.temperature2)
          }
        })
      )
    )
  }
}
