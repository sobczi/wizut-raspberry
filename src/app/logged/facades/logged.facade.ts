import { Injectable, OnDestroy } from '@angular/core'
import { AppStore } from '@app/store'
import { PhotoTemperature } from '@logged/models/photo-temperature'
import {
  FetchImagesRequest,
  selectLoadingState,
  selectPhotosTemperatures,
  UpdateLoadingState
} from '@logged/store'
import { Store } from '@ngrx/store'
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Injectable()
export class LoggedFacade implements OnDestroy {
  readonly loadingState$: Observable<boolean>
  readonly photosTemperatures$: Observable<PhotoTemperature[]>

  private readonly unsubscribe$ = new Subject<void>()

  constructor (private readonly store: Store<AppStore>) {
    this.loadingState$ = this.store
      .select(selectLoadingState)
      .pipe(takeUntil(this.unsubscribe$))
    this.photosTemperatures$ = this.store
      .select(selectPhotosTemperatures)
      .pipe(takeUntil(this.unsubscribe$))
  }

  ngOnDestroy (): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  dispatchFetchImagesRequest (
    dateFrom: Date,
    dateTo: Date,
    force?: boolean
  ): LoggedFacade {
    this.store.dispatch(FetchImagesRequest({ dateFrom, dateTo, force }))
    return this
  }

  dispatchUpdateLoadingState (loadingState: boolean): LoggedFacade {
    this.store.dispatch(UpdateLoadingState({ loadingState }))
    return this
  }
}
