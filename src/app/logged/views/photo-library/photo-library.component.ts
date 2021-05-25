import { DOCUMENT } from '@angular/common'
import { Component, Inject, OnDestroy } from '@angular/core'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective
} from '@angular/forms'
import {
  DateAdapter,
  ErrorStateMatcher,
  MAT_DATE_FORMATS
} from '@angular/material/core'
import {
  AppDateAdapter,
  APP_DATE_FORMATS
} from '@logged/adapters/custom-date-adapter'
import { LoggedFacade } from '@logged/facades/logged.facade'
import { PhotoTemperature } from '@logged/models/photo-temperature'
import {
  dateFromBiggerThanDateToErrorString as dateErrorString,
  dateFromBiggerThanDateToValidator
} from '@logged/validators/dateFromBiggerThanDateToValidator'
import {
  temperatureFromBiggerThanTemperatureToErrorString as temperatureErrorString,
  temperatureFromBiggerThanTemperatureToValidator
} from '@logged/validators/temperatureFromBiggerThanTemperatureToValidator'
import { Subject } from 'rxjs'
import { filter, map, takeUntil, tap } from 'rxjs/operators'

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  constructor (
    private readonly touchedControlsKeys: string[],
    private readonly error: string
  ) {}

  isErrorState (
    control: FormControl | null,
    form: FormGroupDirective | null
  ): boolean {
    const untouchedControlsNotFound =
      this.touchedControlsKeys
        .map(touchedControl => form.form.controls[touchedControl]?.touched)
        .findIndex(touched => !touched) === -1

    return form.hasError(this.error) && untouchedControlsNotFound
  }
}

@Component({
  selector: 'app-photo-library',
  templateUrl: './photo-library.component.html',
  styleUrls: ['./photo-library.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class PhotoLibraryComponent implements OnDestroy {
  // TODO login debug && fix

  currentPage = 1
  listStyle: Record<string, string> = { 'min-height': '712px' }
  loadingState = true

  readonly dateErrorMatcher = new CustomErrorStateMatcher(
    ['dateFrom', 'dateTo'],
    dateErrorString
  )
  readonly temperatureErrorMatcher = new CustomErrorStateMatcher(
    ['temperatureFrom', 'temperatureTo'],
    temperatureErrorString
  )
  readonly form: FormGroup

  private currentImages: PhotoTemperature[] = []
  private allImages: PhotoTemperature[] = []

  private readonly untilDestroy$ = new Subject<void>()

  get images (): PhotoTemperature[] {
    const { pagination } = this.form.value
    const end = this.currentPage * pagination
    return this.currentImages.slice(end - pagination, end)
  }

  get pages (): number[] {
    const { pagination } = this.form.value
    const imagesLength = this.currentImages.length
    const maxPage = Math.ceil(imagesLength / pagination)

    let pages: number[] = []

    Array(3)
      .fill(0)
      .forEach((_, idx) => pages.push(this.currentPage - 1 + idx))

    pages = pages
      .filter(e => e > 0)
      .filter(e => e >= this.currentPage - 1 && e <= this.currentPage + 1)
      .filter(e => e > 0 && e <= maxPage)

    if (pages[pages.length - 1] < maxPage) {
      pages = [...pages, -1, maxPage]
    }

    if (pages[0] > 1) {
      pages = [1, -1, ...pages]
    }

    return pages
  }

  constructor (
    fb: FormBuilder,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly loggedFacade: LoggedFacade
  ) {
    this.form = fb.group(
      {
        dateFrom: [undefined],
        dateTo: [undefined],
        temperatureFrom: [undefined],
        temperatureTo: [undefined],
        pagination: [8]
      },
      {
        validators: [
          dateFromBiggerThanDateToValidator('dateFrom', 'dateTo'),
          temperatureFromBiggerThanTemperatureToValidator(
            'temperatureFrom',
            'temperatureTo'
          )
        ]
      }
    )

    this.form.controls.pagination.valueChanges
      .pipe(
        takeUntil(this.untilDestroy$),
        tap(pagination => {
          let height = '712px'
          if (pagination === 12) {
            height = '1040px'
          }

          if (pagination === 16) {
            height = '1368px'
          }

          if (pagination === 20) {
            height = '1696px'
          }

          this.listStyle = { 'min-height': height }
        }),
        filter(
          pagination =>
            this.currentPage > Math.ceil(this.currentImages.length / pagination)
        ),
        map(pagination => Math.ceil(this.currentImages.length / pagination))
      )
      .subscribe(currentPage => (this.currentPage = currentPage))

    this.loggedFacade.loadingState$
      .pipe(takeUntil(this.untilDestroy$))
      .subscribe({
        next: loadingState => (this.loadingState = loadingState)
      })

    this.loggedFacade
      .dispatchUpdateLoadingState(true)
      .dispatchFetchImagesRequest()
      .photosTemperatures$.pipe(
        filter(v => !!v),
        tap(() => this.loggedFacade.dispatchUpdateLoadingState(false))
      )
      .subscribe({
        next: photoTemperatures => {
          this.allImages = photoTemperatures
          this.currentImages = this.allImages
        }
      })
  }

  ngOnDestroy (): void {
    this.untilDestroy$.next()
    this.untilDestroy$.complete()
  }

  handleChangePage (page: number): void {
    if (page === -1) {
      return
    }

    this.currentPage = page
  }

  handleSwitchPage (previous: boolean): void {
    const { pagination } = this.form.value
    const minusOverflow = previous && this.currentPage === 1
    const plusOverflow =
      !previous &&
      this.currentPage === Math.ceil(this.currentImages.length / pagination)

    if (minusOverflow || plusOverflow) {
      return
    }

    this.currentPage += previous ? -1 : 1
    this.document
      .querySelector('.mat-toolbar')
      .scrollIntoView({ behavior: 'smooth' })
  }

  handleRefreshImages (): void {
    this.loggedFacade.dispatchFetchImagesRequest(true)
  }

  handleSubmitForm (): void {
    const { dateFrom, dateTo, temperatureFrom, temperatureTo } = this.form.value
    const temperatureFromIsNumber = typeof temperatureFrom === 'number'
    const temperatureToIsNumber = typeof temperatureTo === 'number'

    if (
      !dateFrom &&
      !dateTo &&
      !temperatureFromIsNumber &&
      !temperatureToIsNumber
    ) {
      this.currentImages = this.allImages
      return
    }

    if (
      this.form.hasError(dateErrorString) ||
      this.form.hasError(temperatureErrorString)
    ) {
      this.form.markAllAsTouched()
      return
    }

    this.currentImages = this.allImages.filter(i => {
      let dateFromOK = true
      let dateToOK = true
      let temperatureOK = true
      let temperaturesHandled = false

      if (dateFrom) {
        dateFromOK = dateFrom.getTime() <= i.imageDate.getTime()
      }

      if (dateTo) {
        dateToOK = dateTo.getTime() >= i.imageDate.getTime()
      }

      if (temperatureFromIsNumber && temperatureToIsNumber) {
        temperatureOK =
          i.firstTemperature >= temperatureFrom &&
          i.firstTemperature <= temperatureTo
        temperaturesHandled = true
      }

      if (!temperaturesHandled && temperatureFromIsNumber) {
        temperatureOK = i.firstTemperature >= temperatureFrom
        temperaturesHandled = true
      }

      if (!temperaturesHandled && temperatureToIsNumber) {
        temperatureOK = i.firstTemperature <= temperatureTo
        temperaturesHandled = true
      }

      return dateFromOK && dateToOK && temperatureOK
    })

    this.currentPage = 1
  }
}
