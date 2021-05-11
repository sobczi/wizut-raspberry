import { DOCUMENT } from '@angular/common'
import { Component, Inject, OnDestroy } from '@angular/core'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm
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
import { LoggedService } from '@logged/services/logged.service'
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

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState (
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const hasError = [temperatureErrorString, dateErrorString].map(
      e => control.hasError(e) || form.hasError(e)
    )
    return hasError.find(e => !!e)
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
  currentPage = 1
  listStyle: Record<string, string> = { 'min-height': '712px' }

  readonly customErrorMatcher = new MyErrorStateMatcher()
  readonly form: FormGroup

  private currentImages = []
  private allImages = []

  private readonly untilDestroy$ = new Subject<void>()

  get images (): any[] {
    const { pagination } = this.form.value
    const end = this.currentPage * pagination
    return this.currentImages.slice(end - pagination, end)
  }

  get pages (): number[] {
    const { pagination } = this.form.value
    const imagesLength = this.currentImages.length
    const maxPage = Math.ceil(imagesLength / pagination)

    let pages = []

    Array(5)
      .fill(0)
      .forEach((_, idx) => pages.push(this.currentPage - 2 + idx))

    pages = pages
      .filter(e => e > 0)
      .filter(e => e >= this.currentPage - 2 && e <= this.currentPage + 2)
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
    private readonly loggedService: LoggedService,
    @Inject(DOCUMENT) private readonly document: Document
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

    // MOCKS
    // this.loggedService.fetchImages().subscribe()
    Array(200)
      .fill(1)
      .forEach((element, idx) =>
        this.allImages.push({
          image: 'assets/images/example.jpeg',
          temperature: idx,
          date: this.createCustomDayString(idx)
        })
      )
    this.currentImages = this.allImages
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

  handleRefreshImages (): void {}

  handleSubmitForm (): void {
    const { dateFrom, dateTo, temperatureFrom, temperatureTo } = this.form.value
    const temperatureFromIsNumber = temperatureFrom !== null
    const temperatureToIsNumber = temperatureTo !== null

    if (
      !dateFrom &&
      !dateTo &&
      !temperatureFromIsNumber &&
      !temperatureToIsNumber
    ) {
      return
    }

    if (
      this.form.hasError(dateErrorString) ||
      this.form.hasError(temperatureErrorString)
    ) {
      return
    }

    this.currentImages = this.allImages.filter(i => {
      let dateFromOK = true
      let dateToOK = true
      let temperatureOK = true
      let temperaturesHandled = false

      if (dateFrom) {
        dateFromOK = dateFrom.getTime() <= i.date
      }

      if (dateTo) {
        dateToOK = dateTo.getTime() >= i.date
      }

      if (temperatureFromIsNumber && temperatureToIsNumber) {
        temperatureOK =
          i.temperature >= temperatureFrom && i.temperature <= temperatureTo
        temperaturesHandled = true
      }

      if (!temperaturesHandled && temperatureFromIsNumber) {
        temperatureOK = i.temperature >= temperatureFrom
        temperaturesHandled = true
      }

      if (!temperaturesHandled && temperatureToIsNumber) {
        temperatureOK = i.temperature <= temperatureTo
        temperaturesHandled = true
      }

      return dateFromOK && dateToOK && temperatureOK
    })

    this.currentPage = 1
  }

  private createCustomDayString (days: number): Date {
    const today = new Date()
    today.setDate(today.getDate() + days)
    return today
  }
}
