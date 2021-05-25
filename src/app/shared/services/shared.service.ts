import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env/environment'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

@Injectable()
export class SharedService {
  constructor (private readonly http: HttpClient) {}

  login (username: string, password: string): Observable<string | boolean> {
    if (!environment.production) {
      return of('def')
    }

    return this.http
      .post<{ key: string }>(environment.login, {
        username,
        password
      })
      .pipe(
        map(({ key }) => key),
        catchError(() => of(false))
      )
  }

  logout (key: string): Observable<void> {
    if (!environment.production) {
      return of()
    }

    return this.http.post<any>(environment.logout, { key })
  }
}
