import {OrderBook} from './OrderBook'
import {
	OrderBook as OrderBookZeroX,
	UIOrderV4 as UIOrderZeroX,
	OrderSide,
	OrderBookItem,
} from '../../util/types'
import { OrderStatus } from '@0x/types'; 
import {ZeroX} from '../ZeroX'
import {BigNumber} from '0x.js'

type OrderBookItem_ = OrderBookItem & {
	makers: string[];
};

export let getOrderBookZeroX = (orderBook: OrderBook, account?: string): OrderBookZeroX => (
	(({makeBuyOrders, makeSellOrders}) => (
		(({buyOrders, sellOrders, mySizeOrders}) => ({
			buyOrders,
			sellOrders,
			mySizeOrders,
		}))({
			buyOrders: (
				makeBuyOrders().reduce((acc, bid) => (
					((i = acc.findIndex(({price}) => price.comparedTo(bid.price) == 0)) => (
						i == -1 ? (acc.push(bid), acc) : (
							acc[i].size = acc[i].size.plus(bid.size),
							bid.makers.forEach(maker => {
								if (acc[i].makers.indexOf(maker) == -1) {
									acc[i].makers.push(maker);
								}
							}),
							acc
						)
					))()
				), <OrderBookItem_[]>[])
			),
			sellOrders: (
				makeSellOrders().reduce((acc, ask) => (
					((i = acc.findIndex(({price}) => price.comparedTo(ask.price) == 0)) => (
						i == -1 ? (acc.push(ask), acc) : (
							acc[i].size = acc[i].size.plus(ask.size),
							ask.makers.forEach(maker => {
								if (acc[i].makers.indexOf(maker) == -1) {
									acc[i].makers.push(maker);
								}
							}),
							acc
						)
					))()
				), <OrderBookItem_[]>[])
			),
			mySizeOrders: (
				!account ? [] : (
					(account => (
						makeBuyOrders().concat(makeSellOrders())
							.filter(order => order.makers.every(maker => maker.toLowerCase() === account))
					))(account.toLowerCase())
				)
			),
		})
	))({
		makeBuyOrders: () => (
			orderBook.bids
				.map(bid => (<OrderBookItem_>{
					side: OrderSide.Buy,
					size: bid.order.remainingFillableTakerAmount,
					price: bid.order.unitPrice,
					makers: [bid.order.maker],
				}))
		),
		makeSellOrders: () => (
			orderBook.asks
				.map(ask => (<OrderBookItem_>{
					side: OrderSide.Sell,
					size: ask.order.remainingFillableTakerAmount.div(ask.order.unitPrice),
					price: ask.order.unitPrice,
					makers: [ask.order.maker],
				}))
		),
	})
);

export let getUIOrderZeroX = (orderBook: OrderBook, account: string, zerox: ZeroX['zerox']): UIOrderZeroX[] => {
	account = account.toLowerCase();
	return (
		(acc => (
			orderBook.bids
				.reduce((acc, bid) => (
					bid.order.maker.toLowerCase() !== account ? acc : (
						acc.push({
							side: OrderSide.Buy,
							size: bid.order.takerAmount,
							filled: bid.order.takerAmount.minus(bid.order.remainingFillableTakerAmount),
							price: bid.order.unitPrice,
							status: OrderStatus.Fillable,
							onCancel: !zerox ? () => {} : (
								(order => (
									() => (
										zerox.estimateGas.cancelLimitOrder(order)
											.then(gas => zerox.cancelLimitOrder(order, {gasLimit: gas.mul(2)}))
									)
								))(Object.assign({}, bid.order, {
									makerAmount: bid.order.makerAmount.toString(),
									takerAmount: bid.order.takerAmount.toString(),
									takerTokenFeeAmount: bid.order.takerTokenFeeAmount.toString(),
									expiry: bid.order.expiry.toString(),
									salt: bid.order.salt.toString(),
								}))
							)
						}),
						acc
					)
				), acc)
		))(
			orderBook.asks
				.reduce((acc, ask) => (
					account && ask.order.maker.toLowerCase() !== account ? acc : (
						acc.push({
							side: OrderSide.Sell,
							size: ask.order.makerAmount,
							filled: ask.order.takerAmount.minus(ask.order.remainingFillableTakerAmount).div(ask.order.unitPrice),
							price: ask.order.unitPrice,
							status: OrderStatus.Fillable,
							onCancel: !zerox ? () => {} : (
								(order => (
									() => (
										zerox.estimateGas.cancelLimitOrder(order)
											.then(gas => zerox.cancelLimitOrder(order, {gasLimit: gas.mul(2)}))
									)
								))(Object.assign({}, ask.order, {
									makerAmount: ask.order.makerAmount.toString(),
									takerAmount: ask.order.takerAmount.toString(),
									takerTokenFeeAmount: ask.order.takerTokenFeeAmount.toString(),
									expiry: ask.order.expiry.toString(),
									salt: ask.order.salt.toString(),
								}))
							)
						}),
						acc
					)
				), <UIOrderZeroX[]>[])
		)
	);
};