import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env/environment'
import { Observable } from 'rxjs'

@Injectable()
export class LoggedService {
  constructor (private readonly http: HttpClient) {}

  fetchImages (): Observable<any> {
    return this.http.get(environment.data)
  }
}
