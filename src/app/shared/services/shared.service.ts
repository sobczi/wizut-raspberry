import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env/environment'
import { Observable, of } from 'rxjs'

@Injectable()
export class SharedService {
  constructor (private readonly http: HttpClient) {}

  login (
    username: string,
    password: string
  ): Observable<{ refresh: string; access: string } | boolean> {
    return of({ refresh: 'abc', access: 'def' })
    // return this.http
    // .post<{ refresh: string; access: string }>(environment.login, {
    // username,
    // password
    // })
    // .pipe(
    // map(({ refresh, access }) => ({ refresh, access })),
    // catchError(() => of(false))
    // )
  }

  logout (): Observable<void> {
    return this.http.get<any>(environment.logout)
  }
}
