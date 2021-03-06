import { assetDataUtils } from '@0x/order-utils';
import { SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';

import { isWeth, isZrx } from './known_tokens';
import {
    OrderFeeData,
    OrderSide,
    Step,
    StepKind,
    StepToggleTokenLock,
    StepWrapEth,
    Token,
    TokenBalance,
} from './types';

export const createBuySellLimitSteps = (
    baseToken: Token,
    quoteToken: Token,
    tokenBalances: TokenBalance[],
    wethTokenBalance: TokenBalance,
    amount: BigNumber,
    price: BigNumber,
    side: OrderSide,
    orderFeeData: OrderFeeData,
): Step[] => {
    const buySellLimitFlow: Step[] = [];
    let unlockTokenStep;

    // unlock base and quote tokens if necessary

    unlockTokenStep =
        side === OrderSide.Buy
            ? // If it's a buy -> the quote token has to be unlocked
              getUnlockTokenStepIfNeeded(quoteToken, tokenBalances, wethTokenBalance)
            : // If it's a sell -> the base token has to be unlocked
              getUnlockTokenStepIfNeeded(baseToken, tokenBalances, wethTokenBalance);

    if (unlockTokenStep) {
        buySellLimitFlow.push(unlockTokenStep);
    }

    if (orderFeeData.makerFee.isGreaterThan(0)) {
        const { tokenAddress } = assetDataUtils.decodeERC20AssetData(orderFeeData.makerFeeAssetData);
        if (!unlockTokenStep || unlockTokenStep.token.address !== tokenAddress) {
            const unlockFeeTokenStep = getUnlockFeeAssetStepIfNeeded(tokenBalances, tokenAddress);
            if (unlockFeeTokenStep) {
                buySellLimitFlow.push(unlockFeeTokenStep);
            }
        }
    }

    // wrap the necessary ether if it is one of the traded tokens
    if (isWeth(baseToken.symbol) || isWeth(quoteToken.symbol)) {
        const wrapEthStep = getWrapEthStepIfNeeded(amount, price, side, wethTokenBalance);
        if (wrapEthStep) {
            buySellLimitFlow.push(wrapEthStep);
        }
    }

    buySellLimitFlow.push({
        kind: StepKind.BuySellLimit,
        amount,
        price,
        side,
        token: baseToken,
    });

    return buySellLimitFlow;
};

export const createBuySellMarketSteps = (
    baseToken: Token,
    quoteToken: Token,
    tokenBalances: TokenBalance[],
    wethTokenBalance: TokenBalance,
    ethBalance: BigNumber,
    amount: BigNumber,
    side: OrderSide,
    price: BigNumber,
    orderFeeData: OrderFeeData,
): Step[] => {
    const buySellMarketFlow: Step[] = [];
    const isBuy = side === OrderSide.Buy;
    const tokenToUnlock = isBuy ? quoteToken : baseToken;

    const unlockTokenStep = getUnlockTokenStepIfNeeded(tokenToUnlock, tokenBalances, wethTokenBalance);
    // Unlock token step should be added if it:
    // 1) it's a sell, or
    const isSell = unlockTokenStep && side === OrderSide.Sell;
    // 2) is a buy and
    // base token is not weth and is locked, or
    // base token is weth, is locked and there is not enouth plain ETH to fill the order
    const isBuyWithWethConditions =
        isBuy &&
        unlockTokenStep &&
        (!isWeth(tokenToUnlock.symbol) ||
            (isWeth(tokenToUnlock.symbol) && ethBalance.isLessThan(amount.multipliedBy(price))));
    if (isSell || isBuyWithWethConditions) {
        buySellMarketFlow.push(unlockTokenStep as Step);
    }

    // unlock fees if the taker fee is positive
    if (orderFeeData.takerFee.isGreaterThan(0)) {
        const { tokenAddress } = assetDataUtils.decodeERC20AssetData(orderFeeData.takerFeeAssetData);
        if (!unlockTokenStep || (unlockTokenStep && unlockTokenStep.token.address !== tokenAddress)) {
            const unlockFeeStep = getUnlockFeeAssetStepIfNeeded(tokenBalances, tokenAddress);
            if (unlockFeeStep) {
                buySellMarketFlow.push(unlockFeeStep);
            }
        }
    }

    // wrap the necessary ether if necessary
    if (isWeth(quoteToken.symbol)) {
        const wrapEthStep = getWrapEthStepIfNeeded(amount, price, side, wethTokenBalance, ethBalance);
        if (wrapEthStep) {
            buySellMarketFlow.push(wrapEthStep);
        }
    }

    buySellMarketFlow.push({
        kind: StepKind.BuySellMarket,
        amount,
        side,
        token: baseToken,
    });
    return buySellMarketFlow;
};

export const getUnlockTokenStepIfNeeded = (
    token: Token,
    tokenBalances: TokenBalance[],
    wethTokenBalance: TokenBalance,
): StepToggleTokenLock | null => {
    const tokenBalance: TokenBalance = isWeth(token.symbol)
        ? wethTokenBalance
        : (tokenBalances.find(tb => tb.token.symbol === token.symbol) as TokenBalance);
    if (tokenBalance.isUnlocked) {
        return null;
    } else {
        return {
            kind: StepKind.ToggleTokenLock,
            token: tokenBalance.token,
            isUnlocked: false,
            context: 'order',
        };
    }
};

export const getWrapEthStepIfNeeded = (
    amount: BigNumber,
    price: BigNumber,
    side: OrderSide,
    wethTokenBalance: TokenBalance,
    ethBalance?: BigNumber,
): StepWrapEth | null => {
    // Weth needed only when creating a buy order
    if (side === OrderSide.Sell) {
        return null;
    }

    const wethAmountNeeded = amount.multipliedBy(price);

    // If we have enough WETH, we don't need to wrap
    if (wethTokenBalance.balance.isGreaterThan(wethAmountNeeded)) {
        return null;
    }

    // Weth needed only if not enough plain ETH to use forwarder
    if (ethBalance && ethBalance.isGreaterThan(wethAmountNeeded)) {
        return null;
    }

    const wethBalance = wethTokenBalance.balance;
    const deltaWeth = wethBalance.minus(wethAmountNeeded);
    // Need to wrap eth only if weth balance is not enough
    if (deltaWeth.isLessThan(0)) {
        return {
            kind: StepKind.WrapEth,
            currentWethBalance: wethBalance,
            newWethBalance: wethAmountNeeded,
            context: 'order',
        };
    } else {
        return null;
    }
};

export const getUnlockFeeAssetStepIfNeeded = (
    tokenBalances: TokenBalance[],
    feeTokenAddress: string,
): StepToggleTokenLock | null => {
    const balance = tokenBalances.find(tokenBalance => tokenBalance.token.address === feeTokenAddress);
    if (!balance) {
        throw new Error(`Unknown fee token: ${feeTokenAddress}`);
    }
    if (!balance.isUnlocked) {
        return {
            kind: StepKind.ToggleTokenLock,
            token: balance.token,
            isUnlocked: false,
            context: 'order',
        };
    }
    return null;
};

export const getUnlockZrxStepIfNeeded = (tokenBalances: TokenBalance[]): StepToggleTokenLock | null => {
    const zrxTokenBalance: TokenBalance = tokenBalances.find(tokenBalance =>
        isZrx(tokenBalance.token.symbol),
    ) as TokenBalance;
    if (zrxTokenBalance.isUnlocked) {
        return null;
    } else {
        return {
            kind: StepKind.ToggleTokenLock,
            token: zrxTokenBalance.token,
            isUnlocked: false,
            context: 'order',
        };
    }
};
