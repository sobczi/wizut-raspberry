import { Injectable } from '@angular/core'
import { AppStore } from '@app/store'
import { LoggedService } from '@logged/services/logged.service'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import {
  FetchImagesRequest,
  FetchImagesResponse,
  FetchImagesStore
} from './logged.actions'
import { selectUsedDates } from './logged.selectors'

@Injectable()
export class LoggedEffects {
  private readonly fetchImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FetchImagesRequest),
      mergeMap(({ dateFrom, dateTo, force }) =>
        this.store.select(selectUsedDates).pipe(
          map(usedDates =>
            usedDates.find(e => e.dateFrom === dateFrom && e.dateTo === dateTo)
          ),
          mergeMap(found =>
            found && !force
              ? of(FetchImagesStore({ photosTemperatures: [] }))
              : this.service.fetchImagesByDate(dateFrom, dateTo).pipe(
                  mergeMap(photosTemperatures =>
                    of(
                      FetchImagesResponse({
                        dateFrom,
                        dateTo,
                        photosTemperatures
                      })
                    )
                  )
                )
          )
        )
      )
    )
  )

  constructor (
    private readonly actions$: Actions,
    private readonly service: LoggedService,
    private readonly store: Store<AppStore>
  ) {}
}
