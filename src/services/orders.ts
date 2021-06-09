import { SignedOrder } from '@0x/connect';
import { assetDataUtils } from '@0x/order-utils';
import { BigNumber } from '@0x/utils';

import { getLogger } from '../util/logger';
import { getTransactionOptions } from '../util/transactions';
import { Token } from '../util/types';
import { ordersToUIOrders } from '../util/ui_orders';

import { getContractWrappers } from './contract_wrappers';
import { getWeb3Wrapper } from './web3_wrapper';

const logger = getLogger('Services::Orders');


export const getAllOrdersAsUIOrdersWithoutOrdersInfo = async (
    baseToken: Token,
    quoteToken: Token,
    makerAddresses: string[] | null,
) => {
};



export const cancelSignedOrder = async (order: SignedOrder, gasPrice: BigNumber) => {
    const contractWrappers = await getContractWrappers();
    const web3Wrapper = await getWeb3Wrapper();
    const tx = await contractWrappers.exchange.cancelOrder(order).sendTransactionAsync({
        from: order.makerAddress,
        ...getTransactionOptions(gasPrice),
    });
    return web3Wrapper.awaitTransactionSuccessAsync(tx);
};
