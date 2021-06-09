import { push, replace } from 'connected-react-router';
import queryString from 'query-string'; 

import { ERC20_APP_BASE_PATH, ERC721_APP_BASE_PATH } from '../../common/constants';
import { ThunkCreator } from '../../util/types';
import { getCurrentRoutePath } from '../selectors';

export const goToHome: ThunkCreator = () => {
    return async (dispatch, getState) => {
        const state = getState();
        const currentRoute = getCurrentRoutePath(state);
        currentRoute.includes(ERC20_APP_BASE_PATH) ? dispatch(goToHomeErc20()) : dispatch(goToHomeErc721());
    };
};

const goToHomeErc20: ThunkCreator = () => {
    return async (dispatch, getState) => {
        const state = getState();

        dispatch(
            push({
                ...state.router.location,
                pathname: `${ERC20_APP_BASE_PATH}/`,
            }),
        );
    };
};

export const goToWallet: ThunkCreator = () => {
    return async (dispatch, getState) => {
        const state = getState();

        dispatch(
            push({
                ...state.router.location,
                pathname: `${ERC20_APP_BASE_PATH}/my-wallet`,
            }),
        );
    };
};
export const goToMarketPlace: ThunkCreator = () => {
    return async (dispatch, getState) => {
        const state = getState();

        dispatch(
            push({
                ...state.router.location,
                pathname: `${ERC20_APP_BASE_PATH}/`,
            }),
        );
    };
};
const goToHomeErc721 = () => {
    return async (dispatch: any, getState: any) => {
        const state = getState();

        dispatch(
            push({
                ...state.router.location,
                pathname: `${ERC721_APP_BASE_PATH}/`,
            }),
        );
    };
};

export interface SearchObject{
    [key: string]: any;
}