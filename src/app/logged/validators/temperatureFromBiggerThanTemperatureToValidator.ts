import { FormGroup, ValidationErrors } from '@angular/forms'

export const temperatureFromBiggerThanTemperatureToErrorString =
  'temperatureFromBiggerThanToError'

export const temperatureFromBiggerThanTemperatureToValidator = (
  temperatureFrom: string,
  temperatureTo: string
) => {
  return (control: FormGroup): ValidationErrors | null => {
    const from = Number(control.get(temperatureFrom).value)
    const to = Number(control.get(temperatureTo).value)

    if (!from || !to) {
      return null
    }

    if (from > to) {
      return { temperatureFromBiggerThanToError: true }
    }
  }
}
