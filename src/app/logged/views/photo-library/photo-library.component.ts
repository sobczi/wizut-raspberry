import { Component } from '@angular/core'
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
import {
  dateFromBiggerThanDateToErrorString as dateErrorString,
  dateFromBiggerThanDateToValidator
} from '@logged/validators/dateFromBiggerThanDateToValidator'
import {
  temperatureFromBiggerThanTemperatureToErrorString as temperatureErrorString,
  temperatureFromBiggerThanTemperatureToValidator
} from '@logged/validators/temperatureFromBiggerThanTemperatureToValidator'

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState (
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const x = [temperatureErrorString, dateErrorString].map(
      e => control.hasError(e) || form.hasError(e)
    )
    return x.find(e => !!e)
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
export class PhotoLibraryComponent {
  currentImages = []
  currentPage = 1
  readonly customErrorMatcher = new MyErrorStateMatcher()
  readonly form: FormGroup
  private allImages = []

  get currentScope (): any[] {
    const x = this.currentPage * 8
    return this.allImages.slice(x, x + 8)
  }

  constructor (fb: FormBuilder) {
    this.form = fb.group(
      {
        dateFrom: [undefined],
        dateTo: [undefined],
        temperatureFrom: [undefined],
        temperatureTo: [undefined]
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

    Array(100)
      .fill(1)
      .forEach((element, idx) =>
        this.allImages.push({
          image: 'assets/images/example.jpeg',
          temperature: `${Math.floor(Math.random() * (42 - 36 + 1)) + 36}°C`,
          date: this.createCustomDayString(idx)
        })
      )

    this.currentImages = this.allImages
  }

  submitForm (): void {
    const { dateFrom, dateTo } = this.form.value

    if (!dateFrom && !dateTo) {
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

      if (dateFrom) {
        dateFromOK = dateFrom.getTime() <= i.date
      }

      if (dateTo) {
        dateToOK = dateTo.getTime() >= i.date
      }

      return dateFromOK && dateToOK
    })
  }

  private createCustomDayString (days: number): Date {
    const today = new Date()
    today.setDate(today.getDate() + days)
    return today
  }
}
