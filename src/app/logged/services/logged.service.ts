import { DatePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env/environment'
import { DataResponse } from '@logged/models/data-response'
import { PhotoTemperature } from '@logged/models/photo-temperature'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class LoggedService {
  constructor (
    private readonly http: HttpClient,
    private readonly datePipe: DatePipe
  ) {}

  fetchImagesByDate (from: Date, to: Date): Observable<PhotoTemperature[]> {
    if (!environment.production) {
      return this.mockImages()
    }

    const dateFrom = this.datePipe.transform(from, 'yyyy.MM.dd')
    const dateTo = this.datePipe.transform(to, 'yyyy.MM.dd')

    return this.getResponse(environment.dataByDate(dateFrom, dateTo))
  }

  fetchImages (): Observable<PhotoTemperature[]> {
    if (!environment.production) {
      return this.mockImages()
    }

    return this.getResponse(environment.data)
  }

  private getResponse (url: string): Observable<PhotoTemperature[]> {
    return this.http.get<DataResponse>(url).pipe(
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

  private mockImages (): Observable<PhotoTemperature[]> {
    return of(
      Array(250)
        .fill(0)
        .map((_, idx) => ({
          id: idx,
          imageName: `Przykładowa nazwa ${idx}`,
          imageUrl: '',
          imageDate: new Date(),
          firstTemperature: idx,
          secondTemperature: idx
        }))
    )
  }
}
