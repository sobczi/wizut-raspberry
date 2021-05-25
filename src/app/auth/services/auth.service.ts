import { Injectable, OnDestroy } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { Actions, ofType } from '@ngrx/effects'
import { TranslateService } from '@ngx-translate/core'
import { SharedFacade } from '@shared/facades'
import { DialogService } from '@shared/services'
import { LogoutRequest } from '@shared/store'
import { ReplaySubject, Subject } from 'rxjs'
import { filter, takeUntil } from 'rxjs/operators'

@Injectable()
export class AuthService implements OnDestroy {
  readonly username$ = new ReplaySubject<string>()

  private _username: string
  private _key: string

  private readonly USERNAME_STORAGE = 'USERNAME'
  private readonly KEY = 'KEY'
  private readonly unsubscribe$ = new Subject<void>()
  get username (): string {
    return this._username
  }

  constructor (
    private readonly router: Router,
    private readonly actions$: Actions,
    private readonly dialogRef: MatDialog,
    private readonly dialogService: DialogService,
    private readonly sharedFacade: SharedFacade,
    private readonly translateService: TranslateService
  ) {
    this._username = sessionStorage.getItem(this.USERNAME_STORAGE)
    this._key = sessionStorage.getItem(this.KEY)
    this.username$.next(this._username)

    this.sharedFacade.loginResponse$
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(r => !!r.response)
      )
      .subscribe(({ username, key }) => {
        this._username = username
        this._key = key

        sessionStorage.setItem(this.USERNAME_STORAGE, username)
        sessionStorage.setItem(this.KEY, key)

        this.username$.next(this._username)
      })

    this.actions$
      .pipe(ofType(LogoutRequest), takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.dialogRef.closeAll()
        this.dialogService.openSimpleDialog({
          header: 'logoutDone',
          content: `${this.translateService.instant('goodBye')}, ${
            this._username
          }.`
        })
        delete this._username
        delete this._key

        sessionStorage.clear()

        this.username$.next()

        this.router.navigate(['/shared/home'])
      })
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
