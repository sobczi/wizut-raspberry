import * as LoggedActions from '@logged/store/logged.actions'
import { Action, createReducer, on } from '@ngrx/store'
import * as SharedActions from '@shared/store/shared.actions'
import { LoggedStore } from './types'

const initialState: LoggedStore = {
  photosTemperatures: undefined,
  loadingState: true,
  datesUsed: []
}

const loggedReducer = createReducer(
  initialState,
  on(
    LoggedActions.FetchImagesResponse,
    (state, { dateFrom, dateTo, photosTemperatures }) => ({
      ...state,
      photosTemperatures: state.photosTemperatures
        ? [...state.photosTemperatures, ...photosTemperatures]
        : photosTemperatures,
      datesUsed: state.datesUsed
        ? [...state.datesUsed, { dateFrom, dateTo }]
        : [{ dateFrom, dateTo }]
    })
  ),
  on(LoggedActions.UpdateLoadingState, (state, { loadingState }) => ({
    ...state,
    loadingState
  })),
  on(SharedActions.LogoutResponse, state => ({
    ...state,
    photosTemperatures: undefined
  }))
)

export function LoggedReducer (
  state: LoggedStore,
  action: Action
): LoggedStore {
  return loggedReducer(state, action)
}
