import { Order, SignedOrder } from '@0x/order-utils';
import { BigNumber } from '@0x/utils';

import { PROTOCOL_FEE_MULTIPLIER, ZERO } from '../common/constants';

import { getKnownTokens } from './known_tokens';
import { tokenAmountInUnitsToBigNumber, unitsInTokenAmount } from './tokens';
import { OrderSide, UIOrder } from './types';

interface BuildMarketOrderParams {
    amount: BigNumber;
    orders: UIOrder[];
}

export const buildMarketOrders = (
    params: BuildMarketOrderParams,
    side: OrderSide,
): [SignedOrder[], BigNumber[], boolean] => {
    const { amount, orders } = params;

    // sort orders from best to worse
    const sortedOrders = orders.sort((a, b) => {
        if (side === OrderSide.Buy) {
            return a.price.comparedTo(b.price);
        } else {
            return b.price.comparedTo(a.price);
        }
    });

    const ordersToFill: SignedOrder[] = [];
    const amounts: BigNumber[] = [];
    let filledAmount = ZERO;
    for (let i = 0; i < sortedOrders.length && filledAmount.isLessThan(amount); i++) {
        const order = sortedOrders[i];
        ordersToFill.push(order.rawOrder);

        let available = order.size;
        if (order.filled) {
            available = order.size.minus(order.filled);
        }
        if (filledAmount.plus(available).isGreaterThan(amount)) {
            amounts.push(amount.minus(filledAmount));
            filledAmount = amount;
        } else {
            amounts.push(available);
            filledAmount = filledAmount.plus(available);
        }

        if (side === OrderSide.Buy) {
            // @TODO: cache maker/taker info (decimals)
            const makerTokenDecimals = getKnownTokens().getTokenByAssetData(order.rawOrder.makerAssetData).decimals;
            const takerTokenDecimals = getKnownTokens().getTokenByAssetData(order.rawOrder.takerAssetData).decimals;
            const buyAmount = tokenAmountInUnitsToBigNumber(amounts[i], makerTokenDecimals);
            amounts[i] = unitsInTokenAmount(buyAmount.multipliedBy(order.price).toString(), takerTokenDecimals);
        }
    }
    const canBeFilled = filledAmount.eq(amount);

    const roundedAmounts = amounts.map(a => a.integerValue(BigNumber.ROUND_CEIL));

    return [ordersToFill, roundedAmounts, canBeFilled];
};

export const sumTakerAssetFillableOrders = (
    side: OrderSide,
    ordersToFill: Order[],
    amounts: BigNumber[],
): BigNumber => {
    if (ordersToFill.length !== amounts.length) {
        throw new Error('ordersToFill and amount array lengths must be the same.');
    }
    if (ordersToFill.length === 0) {
        return ZERO;
    }
    return ordersToFill.reduce((sum, order, index) => {
        // Check buildMarketOrders for more details
        const price = side === OrderSide.Buy ? 1 : order.makerAssetAmount.div(order.takerAssetAmount);
        return sum.plus(amounts[index].multipliedBy(price));
    }, ZERO);
};

export const calculateWorstCaseProtocolFee = (orders: SignedOrder[], gasPrice: BigNumber): BigNumber => {
    const protocolFee = new BigNumber(orders.length * PROTOCOL_FEE_MULTIPLIER).times(gasPrice);
    return protocolFee;
};

export const isDutchAuction = (_order: SignedOrder) => {
    return false;
};
