import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, map } from 'rxjs/operators'
import { Observable, of } from 'rxjs'

import { environment } from '@env/environment'

@Injectable()
export class SharedService {
  constructor (private readonly http: HttpClient) {}

  login (
    username: string,
    password: string
  ): Observable<{ refresh: string; access: string } | boolean> {
    // return of({ refresh: 'abc', access: 'def' })
    return this.http
      .post<{ refresh: string; access: string }>(environment.login, {
        username,
        password
      })
      .pipe(
        map(({ refresh, access }) => ({ refresh, access })),
        catchError(() => of(false))
      )
  }
}
