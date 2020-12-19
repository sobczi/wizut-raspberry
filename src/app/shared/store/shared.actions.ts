import { createAction, props } from '@ngrx/store'

import { LoginResponseArgs } from '@shared/models'

export const LoginRequest = createAction(
  '[Shared Component] Login Request',
  props<{ username: string; password: string }>()
)

export const LoginResponse = createAction(
  '[Shared Component] Login Response',
  props<LoginResponseArgs>()
)

export const LogoutRequest = createAction('[Shared Component] Logout Request')
