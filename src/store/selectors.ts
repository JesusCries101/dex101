import { OrderStatus } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { createSelector } from 'reselect';

import { ERC20_APP_BASE_PATH, ZERO } from '../common/constants';
import { isWeth } from '../util/known_tokens';
import {
    MARKETPLACES,
    OrderBook,
    OrderSide,
    SearchTokenBalanceObject,
    StoreState,
    Token,
    TokenBalance,
    Web3State,
} from '../util/types';
import { mergeByPrice } from '../util/ui_orders';

export const getEthAccount = (state: StoreState) => state.blockchain.ethAccount;
export const getTokenBalances = (state: StoreState) => state.blockchain.tokenBalances;
export const getWeb3State = (state: StoreState) => state.blockchain.web3State;
export const getEthBalance = (state: StoreState) => state.blockchain.ethBalance;
export const getWethTokenBalance = (state: StoreState) => state.blockchain.wethTokenBalance;
export const getConvertBalanceState = (state: StoreState) => state.blockchain.convertBalanceState;
export const getWethBalance = (state: StoreState) =>
    state.blockchain.wethTokenBalance ? state.blockchain.wethTokenBalance.balance : ZERO;
export const getOrderPriceSelected = (state: StoreState) => state.ui.orderPriceSelected;
export const getNotifications = (state: StoreState) => state.ui.notifications;
export const getHasUnreadNotifications = (state: StoreState) => state.ui.hasUnreadNotifications;
export const getStepsModalPendingSteps = (state: StoreState) => state.ui.stepsModal.pendingSteps;
export const getStepsModalDoneSteps = (state: StoreState) => state.ui.stepsModal.doneSteps;
export const getStepsModalCurrentStep = (state: StoreState) => state.ui.stepsModal.currentStep;
export const getCurrencyPair = (state: StoreState) => state.market.currencyPair;
export const getMakerAddresses = (state: StoreState) => state.market.makerAddresses;
export const getBaseToken = (state: StoreState) => state.market.baseToken;
export const getQuoteToken = (state: StoreState) => state.market.quoteToken;
export const getMarkets = (state: StoreState) => state.market.markets;
export const getEthInUsd = (state: StoreState) => state.market.ethInUsd;
export const getGasPriceInWei = (state: StoreState) => state.blockchain.gasInfo.gasPriceInWei;
export const getEstimatedTxTimeMs = (state: StoreState) => state.blockchain.gasInfo.estimatedTimeMs;
export const getCurrentRoutePath = (state: StoreState) => state.router.location.pathname;
export const getRouterLocationSearch = (state: StoreState) => state.router.location.search;

export const getCurrentMarketPlace = createSelector(
    getCurrentRoutePath,
    (currentRoute: string) => (currentRoute.includes(ERC20_APP_BASE_PATH) ? MARKETPLACES.ERC20 : MARKETPLACES.ERC721),
);

const searchToken = ({ tokenBalances, tokenToFind, wethTokenBalance }: SearchTokenBalanceObject) => {
    if (tokenToFind && isWeth(tokenToFind.symbol)) {
        return wethTokenBalance;
    }
    return (
        tokenBalances.find(
            (tokenBalance: TokenBalance) => tokenBalance.token.symbol === (tokenToFind && tokenToFind.symbol),
        ) || null
    );
};

export const getTotalEthBalance = createSelector(
    getEthBalance,
    getWethBalance,
    (ethBalance: BigNumber, wethTokenBalance: BigNumber) => ethBalance.plus(wethTokenBalance),
);

export const getBaseTokenBalance = createSelector(
    getTokenBalances,
    getWethTokenBalance,
    getBaseToken,
    (tokenBalances: TokenBalance[], wethTokenBalance: TokenBalance | null, baseToken: Token | null) =>
        searchToken({ tokenBalances, wethTokenBalance, tokenToFind: baseToken }),
);

export const getQuoteTokenBalance = createSelector(
    getTokenBalances,
    getWethTokenBalance,
    getQuoteToken,
    (tokenBalances: TokenBalance[], wethTokenBalance: TokenBalance | null, quoteToken: Token | null) =>
        searchToken({ tokenBalances, wethTokenBalance, tokenToFind: quoteToken }),
);

export const getTokens = createSelector(
    getTokenBalances,
    (tokenBalances): Token[] => {
        return tokenBalances.map((tokenBalance, index) => {
            const { token } = tokenBalance;
            return token;
        });
    },
);