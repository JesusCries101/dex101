import {
  combineReducers,
  Reducer
} from 'redux'
import {
  RootAction as Action
} from '../reducers'
import {
  StoreState as State
} from '../../util/types'
export let login = ((state, action) => (
  state == null || state == undefined ? (
    { authorized: window.localStorage.getItem('cryptosx-user') != null }
  ) : (
      action.type === 'login' ?
        action.payload :
        state
    )
)) as Reducer<State['login'], Action>;