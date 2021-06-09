import { getWeb3Wrapper } from '../services/web3_wrapper';
import { getKnownTokens } from '../util/known_tokens';
import { MARKETPLACES } from '../util/types';
 
import { updateGasInfo, updateTokenBalances } from './blockchain/actions';
import { setMarketTokens, updateMarketPriceEther } from './market/actions';
import { getCurrencyPair, getCurrentMarketPlace } from './selectors';

export * from './api/actions'
export * from './blockchain/actions';
export * from './market/actions';
export * from './router/actions';
export * from './ui/actions';
export * from './market/actions';
export * from './login/actions';

export const updateStore = () => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const web3Wrapper = await getWeb3Wrapper();
        const [ethAccount] = await web3Wrapper.getAvailableAddressesAsync();
        dispatch(updateTokenBalances());
        dispatch(updateGasInfo());
        dispatch(updateMarketPriceEther());

        // Updates based on the current app
        const currentMarketPlace = getCurrentMarketPlace(state);
        if (currentMarketPlace === MARKETPLACES.ERC20) {
            dispatch(updateERC20Store(ethAccount));
        } else {
            dispatch(updateERC20Store(ethAccount));
        }
    };
};


export const updateERC20Store = (ethAccount: string) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        try {
            const knownTokens = getKnownTokens();
            const currencyPair = getCurrencyPair(state);
            const baseToken = knownTokens.getTokenBySymbol(currencyPair.base);
            const quoteToken = knownTokens.getTokenBySymbol(currencyPair.quote);

            dispatch(setMarketTokens({ baseToken, quoteToken }));
        } catch (error) {
            const knownTokens = getKnownTokens();
            const currencyPair = getCurrencyPair(state);
            const baseToken = knownTokens.getTokenBySymbol(currencyPair.base);
            const quoteToken = knownTokens.getTokenBySymbol(currencyPair.quote);

            dispatch(setMarketTokens({ baseToken, quoteToken }));
        }
    };
};
