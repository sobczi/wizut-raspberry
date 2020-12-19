import { createReducer, Action } from '@ngrx/store'

import { SharedStore } from './types'

const initialState: SharedStore = {}

const sharedReducer = createReducer(initialState)

export function SharedReducer (
  state: SharedStore,
  action: Action
): SharedStore {
  return sharedReducer(state, action)
}
