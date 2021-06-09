import { getType } from 'typesafe-actions';

import { ApiState, makePaginatedEntries } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';

const initialState: ApiState = {
    trades: makePaginatedEntries(),
};

export function api(state: ApiState = initialState, action: RootAction): ApiState {
    switch (action.type) {
        case getType(actions.setTradeHistory):
            return { ...state, trades: action.payload };
        default:
            return state;
    }
}
export default api