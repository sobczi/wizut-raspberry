import { Component } from '@angular/core'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm
} from '@angular/forms'
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS } from '@angular/material/core'
import { AppDateAdapter, APP_DATE_FORMATS } from '@logged/adapters/custom-date-adapter'
import {
  dateFromBiggerThanDateToErrorString as dateErrorString,
  dateFromBiggerThanDateToValidator
} from '@logged/validators/dateFromBiggerThanDateToValidator'

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState (
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return control.hasError(dateErrorString) || form.hasError(dateErrorString)
  }
}

@Component({
  selector: 'app-photo-library',
  templateUrl: './photo-library.component.html',
  styleUrls: ['./photo-library.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class PhotoLibraryComponent {
  currentImages = []
  readonly customErrorMatcher = new MyErrorStateMatcher()
  readonly form: FormGroup
  private allImages = []

  constructor (fb: FormBuilder) {
    this.form = fb.group(
      {
        dateFrom: [undefined],
        dateTo: [undefined]
      },
      { validators: dateFromBiggerThanDateToValidator('dateFrom', 'dateTo') }
    )

    Array(100)
      .fill(1)
      .forEach((element, idx) =>
        this.allImages.push({
          image: 'assets/images/example.jpeg',
          name: `example_image_name_ ${idx}.jpeg`,
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

    if (this.form.hasError(dateErrorString)) {
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
