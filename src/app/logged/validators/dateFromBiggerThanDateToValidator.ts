import { FormGroup, ValidationErrors } from '@angular/forms'

export const dateFromBiggerThanDateToErrorString = 'dateFromBiggerThanToError'

export const dateFromBiggerThanDateToValidator = (
  dateFrom: string,
  dateTo: string
) => {
  return (control: FormGroup): ValidationErrors | null => {
    const from: Date = control.get(dateFrom).value
    const to: Date = control.get(dateTo).value

    if (!from || !to) {
      return null
    }

    if (from.getTime() > to.getTime()) {
      return { dateFromBiggerThanToError: true }
    }
  }
}
