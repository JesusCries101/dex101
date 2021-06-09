import React from 'react'
import { ContractWrappers, ERC20TokenContract, } from '@0x/contract-wrappers';
import detectEthereumProvider from '@metamask/detect-provider';
import { useMetaMask } from 'metamask-react';
import axios from 'axios'
import {
	assetDataUtils,
	BigNumber,
	MetamaskSubprovider,
	Web3JsProvider,
	generatePseudoRandomSalt,

} from '0x.js';
import * as utils from '@0x/protocol-utils';
import ERC20TokenList, { CoinData, CoinPair, getERC20TokenByAddress, getMultipler } from '../erc20Token';

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_UP, DECIMAL_PLACES: 8 });

export interface OrderSignature {
	signatureType: number
	r: string
	s: string
	v: number
}

export interface OrderDetailData {
	chainId: number
	expiry: BigNumber
	feeRecipient: string
	maker: string
	makerAmount: BigNumber
	makerToken: string
	pool: string
	salt: BigNumber
	sender: string
	signature: OrderSignature
	taker: string
	takerAmount: BigNumber
	takerToken: string
	takerTokenFeeAmount: BigNumber
	verifyingContract: string
	remainingFillableTakerAmount: BigNumber
	unitPrice: BigNumber
}

interface OrderDetailDataV4 {
	chainId: number
	expiry: string
	feeRecipient: string
	maker: string
	makerAmount: string
	makerToken: string
	pool: string
	salt: string
	sender: string
	signature: OrderSignature
	taker: string
	takerAmount: string
	takerToken: string
	takerTokenFeeAmount: string
	verifyingContract: string
}

export interface OrderMetaData {
	orderHash: string
	createdAt: Date
	remainingFillableTakerAmount: number
}

export interface OrderBookSingleOrder {
	order: OrderDetailData
	metaData: OrderMetaData
}

interface OrderBookSingleOrderV4 {
	order: OrderDetailDataV4
	metaData: OrderMetaData
}

export interface OrderBook {
	bids: OrderBookSingleOrder[];
	asks: OrderBookSingleOrder[];
}

interface OrderBookV4 {
	bids: {
		records: OrderBookSingleOrderV4[];
	};
	asks: {
		records: OrderBookSingleOrderV4[];
	};
} 
 
export let useOrderBook = (assetBase: string, assetQuote: string) => {
	let { account, chainId, status } = useMetaMask();
	let [orderBook, setOrderBook] = React.useState<OrderBook>({bids: [], asks: []});
	let [quoteAsset, setQuoteAsset] = React.useState<CoinData | null>(null);
	let [baseAsset, setBaseAsset] = React.useState<CoinData | null>(null);
	let [triggerUpdateOrderBook, setTriggerUpdateOrderBook] = React.useState(false);
	let toggleTriggerUpdateOrderBook = (assetBase?: string, assetQuote?: string) => {
		if (assetBase && assetQuote) {
			if (chainId) {
				let chainID = parseInt(chainId, 16);
				let baseAsset = ERC20TokenList.find(coin => coin.name === assetBase);
				let quoteAsset = ERC20TokenList.find(coin => coin.name === assetQuote);
				if (baseAsset && quoteAsset) {
					baseAsset.currentChainData = baseAsset.chains.find(({chainId}) => chainId == chainID);
					quoteAsset.currentChainData = quoteAsset.chains.find(({chainId}) => chainId == chainID);
					setBaseAsset(baseAsset);
					setQuoteAsset(quoteAsset);
				}
			}
		} else {
			setTriggerUpdateOrderBook(!triggerUpdateOrderBook);
		}
	};

	let init = (chainID: string) => (
		(chainID => {
			try {
				let baseAsset = ERC20TokenList.find(coin => coin.name === assetBase);
				let quoteAsset = ERC20TokenList.find(coin => coin.name === assetQuote);
				if (baseAsset && quoteAsset) {
					baseAsset.currentChainData = baseAsset.chains.find(({chainId}) => chainId == chainID);
					quoteAsset.currentChainData = quoteAsset.chains.find(({chainId}) => chainId == chainID);
					setBaseAsset(baseAsset);
					setQuoteAsset(quoteAsset);
				} else {
					throw new Error('useOrderBook::init');
				}
			} catch (err) {
				alert(err);
			}
		})(parseInt(chainID, 16))
	);

	let getSortedOrderBook = async (quoteAsset: CoinData, baseAsset: CoinData) => {
		if (!quoteAsset.currentChainData || !baseAsset.currentChainData) {
			alert('can not detect quote Asset in current Chain')
		} else {
			let orderBookRes = await axios.get('https://api.0x.org/sra/v4/orderbook', {
				params: {
					perPage: 1000,
					quoteToken: quoteAsset.currentChainData.address,// usdt
					baseToken: baseAsset.currentChainData.address,// sto
				}
			});
			let orders: OrderBookV4 = orderBookRes.data;
			// unitPrice = quoteAmount / baseAmount
			let sortedOrderBookAsk: OrderBookSingleOrder[] = (
				(orderBook => (
					// bestAsk = lowest unitPrice, upper ask
					orderBook.sort(({order: {unitPrice: unitPrice0}}, {order: {unitPrice: unitPrice1}}) => (
						unitPrice1.comparedTo(unitPrice0)
					)),
					orderBook
				))(
					orders.asks.records
						.filter(({order: {expiry}}) => new BigNumber(Date.now()).isLessThan(new BigNumber(expiry).multipliedBy(new BigNumber(1e3))))
						.map(order => {
							//maker base
							let makerToken = getERC20TokenByAddress(order.order.makerToken);
							let takerToken = getERC20TokenByAddress(order.order.takerToken);
							let multiplier = new BigNumber(1);
							if (makerToken && takerToken) {
								multiplier = getMultipler(makerToken.decimal, takerToken.decimal);
							}
							// quoteAmount = makerAmount, baseAmount = takerAmount
							let unitPrice = new BigNumber(order.order.takerAmount, 10).multipliedBy(multiplier).div(new BigNumber(order.order.makerAmount), 10).decimalPlaces(8);
							let remainingFillableTakerAmount = new BigNumber(order.metaData.remainingFillableTakerAmount, 10);
							return Object.assign(order, {
								order: {
									chainId: order.order.chainId,
									expiry: new BigNumber(order.order.expiry),
									feeRecipient: order.order.feeRecipient,
									maker: order.order.maker,
									makerAmount: new BigNumber(order.order.makerAmount),
									makerToken: order.order.makerToken,
									pool: order.order.pool,
									salt: new BigNumber(order.order.salt),
									sender: order.order.sender,
									signature: order.order.signature,
									taker: order.order.taker,
									takerAmount: new BigNumber(order.order.takerAmount),
									takerToken: order.order.takerToken,
									takerTokenFeeAmount: new BigNumber(order.order.takerTokenFeeAmount),
									verifyingContract: order.order.verifyingContract,
									remainingFillableTakerAmount,
									unitPrice,
								}
							} as OrderBookSingleOrder);
						})
				)
			);

			let sortedOrderBookBid: OrderBookSingleOrder[] = (
				(orderBook => (
					// bestBid = highest unitPrice, lower bid
					orderBook.sort(({order: {unitPrice: unitPrice0}}, {order: {unitPrice: unitPrice1}}) => (
						unitPrice1.comparedTo(unitPrice0)
					)),
					orderBook
				))(
					orders.bids.records
						.filter(({order: {expiry}}) => new BigNumber(Date.now()).isLessThan(new BigNumber(expiry).multipliedBy(new BigNumber(1e3))))
						.map(order => {
							// quoteAmount = takerAmount, baseAmount = makerAmount
							let makerToken = getERC20TokenByAddress(order.order.makerToken);
							let takerToken = getERC20TokenByAddress(order.order.takerToken);
							let multiplier = new BigNumber(1);
							if (makerToken && takerToken) {
								multiplier = getMultipler(takerToken.decimal, makerToken.decimal);
							}
							let unitPrice = new BigNumber(order.order.makerAmount, 10).multipliedBy(multiplier).div(new BigNumber(order.order.takerAmount), 10).decimalPlaces(8)
							let remainingFillableTakerAmount = new BigNumber(order.metaData.remainingFillableTakerAmount, 10)
							return Object.assign(order, {
								order: {
									chainId: order.order.chainId,
									expiry: new BigNumber(order.order.expiry),
									feeRecipient: order.order.feeRecipient,
									maker: order.order.maker,
									makerAmount: new BigNumber(order.order.makerAmount),
									makerToken: order.order.makerToken,
									pool: order.order.pool,
									salt: new BigNumber(order.order.salt),
									sender: order.order.sender,
									signature: order.order.signature,
									taker: order.order.taker,
									takerAmount: new BigNumber(order.order.takerAmount),
									takerToken: order.order.takerToken,
									takerTokenFeeAmount: new BigNumber(order.order.takerTokenFeeAmount),
									verifyingContract: order.order.verifyingContract,
									remainingFillableTakerAmount,
									unitPrice,
								}
							} as OrderBookSingleOrder);
						})
				)
			);

			setOrderBook({
				bids: sortedOrderBookBid,
				asks: sortedOrderBookAsk,
			})
		}
	}

	React.useEffect(() => {
		if (chainId) {
			init(chainId);
		}
	}, [chainId])

	React.useEffect(() => {
		if (baseAsset && quoteAsset) {
			getSortedOrderBook(quoteAsset, baseAsset);
		}
	}, [baseAsset, quoteAsset, triggerUpdateOrderBook]);

	/*React.useEffect(() => {
		alert(JSON.stringify(orderBook,null,2))
	}, [orderBook]);*/

	return {
		orderBook,
		updateOrderBook: toggleTriggerUpdateOrderBook,
	};
};
export type OrderBookHook = ReturnType<typeof useOrderBook>;