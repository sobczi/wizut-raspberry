import { PhotoTemperature } from '@logged/models/photo-temperature'
import { createAction, props } from '@ngrx/store'

export const FetchImagesRequest = createAction(
  '[Logged Component] Fetch Images Request',
  props<{ force?: boolean }>()
)

export const FetchImagesResponse = createAction(
  '[Logged Component] Fetch Images Response',
  props<{ photosTemperatures: PhotoTemperature[] }>()
)

export const FetchImagesStore = createAction(
  '[Logged Component] Fetch Images Store',
  props<{ photosTemperatures: PhotoTemperature[] }>()
)

export const UpdateLoadingState = createAction(
  '[Logged Component] Update Loading State',
  props<{ loadingState: boolean }>()
)
