import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { FormControls } from '@shared/models/FormControls'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  readonly form: FormGroup

  get c (): FormControls {
    return this.form.controls
  }

  constructor (formsBuilder: FormBuilder) {
    this.form = formsBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
}
