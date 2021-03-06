import { createFeatureSelector, createSelector } from '@ngrx/store'
import { LoggedStore, LoggedStoreKey } from './types'

export const selectLoggedFeature = createFeatureSelector<LoggedStore>(
  LoggedStoreKey
)

export const selectPhotosTemperatures = createSelector(
  selectLoggedFeature,
  state => state.photosTemperatures
)

export const selectLoadingState = createSelector(
  selectLoggedFeature,
  state => state.loadingState
)
