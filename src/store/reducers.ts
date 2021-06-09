import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { ActionType } from 'typesafe-actions';

import { StoreState } from '../util/types';
 
import * as actions from './actions';
import {api} from './api/reducers'
import { blockchain } from './blockchain/reducers';
import { market } from './market/reducers';
import { ui } from './ui/reducers';
import { login } from './login/reducers';

export type RootAction = ActionType<typeof actions>;

export const createRootReducer = (history: History) =>
    combineReducers<StoreState>({
        router: connectRouter(history),
        api,
        blockchain,
        ui,
        market,
        login
    });
