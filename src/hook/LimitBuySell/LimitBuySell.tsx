import { useEffect, useState } from 'react'
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
import ERC20TokenList, { CoinData, CoinPair, getMultipler } from '../erc20Token';
import {useZeroX, getOrderZeroX} from '../ZeroX'
import { OrderBookHook, OrderBookSingleOrder } from '../SortedOrderBook';

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_UP, DECIMAL_PLACES: 8 });

let nullAddress = "0x0000000000000000000000000000000000000000"
let globalFeeRecipient = process.env.REACT_APP_FEE_RECIPIENT || nullAddress;
let feePercentage = (
	((feePercentage = process.env.REACT_APP_FEE_PERCENTAGE) => (
		feePercentage ? new BigNumber(feePercentage).div(new BigNumber(1e2)) : new BigNumber(0)
	))()
);
let S = <T extends string>(_: T) => _ as T;

export let useLimitBuySell = (assetBase: string, assetQuote: string, orderBookHook: OrderBookHook) => {
	const { account, chainId, status } = useMetaMask()
	const [web3Provider, setWeb3Provider] = useState<Web3JsProvider>()
	const [contractWrappers, setContractWrappers] = useState<ContractWrappers>()
	
	const [quoteAsset, setQuoteAsset] = useState<CoinData>()
	const [baseAsset, setBaseAsset] = useState<CoinData>()
	const [quoteAssetBalance, setQuoteAssetBalance] = useState<BigNumber>()
	const [baseAssetBalance, setBaseAssetBalance] = useState<BigNumber>()
	const [quoteAssetAllowance, setQuoteAssetAllowance] = useState<BigNumber>()
	const [baseAssetAllowance, setBaseAssetAllowance] = useState<BigNumber>()

	const [limitTradeBaseAmount, setLimitBuyBaseAmount] = useState<BigNumber>(new BigNumber(0))
	const [quoteUnitPrice, setQuoteUnitPrice] = useState<BigNumber>(new BigNumber(0))
	const [quoteTotalPrice, setQuoteTotalPrice] = useState<BigNumber>(new BigNumber(0))

	const [isLimitBuyMode, setIsLimitBuyMode] = useState(true);

	let [takerFilledAmount, setTakerFilledAmount] = useState(new BigNumber(0));
	let [takerFillableOrders, setTakerFillableOrders] = useState<{order: OrderBookSingleOrder; filledAmount: BigNumber}[]>([]);
	let [totalFillablePrice, setTotalFillablePrice] = useState(new BigNumber(0));
	let [totalFillableBaseAmount, setTotalFillableBaseAmount] = useState(new BigNumber(0));
	let [takerTokenFeeAmount, setTakerTokenFeeAmount] = useState(new BigNumber(0));
	let {zerox, gasPrice} = useZeroX();

	useEffect(() => {
		setTakerFillableOrders([]);
	}, [baseAsset, quoteAsset, isLimitBuyMode]);

	useEffect(() => {
		setTakerFilledAmount(limitTradeBaseAmount);
	}, [limitTradeBaseAmount]);

	useEffect(() => {
		if (isLimitBuyMode) {
			setTotalFillablePrice(
				takerFillableOrders.reduce((acc, order) => (
					acc.plus(order.filledAmount)
				), new BigNumber(0))
			);
			setTotalFillableBaseAmount(
				takerFillableOrders.reduce((acc, order) => (
					acc.plus(order.filledAmount.div(order.order.order.unitPrice))
				), new BigNumber(0))
			);
		} else {
			setTotalFillablePrice(
				takerFillableOrders.reduce((acc, order) => (
					acc.plus(order.filledAmount.multipliedBy(order.order.order.unitPrice))
				), new BigNumber(0))
			);
			setTotalFillableBaseAmount(
				takerFillableOrders.reduce((acc, order) => (
					acc.plus(order.filledAmount)
				), new BigNumber(0))
			);
		}
		setTakerTokenFeeAmount(
			takerFillableOrders.reduce((acc, order) => (
				acc.plus(order.order.order.takerTokenFeeAmount.multipliedBy(order.filledAmount.div(order.order.order.takerAmount)))
			), new BigNumber(0))
		);
	}, [takerFillableOrders, isLimitBuyMode]);

	useEffect(() => {
		((takerAmount = takerFilledAmount) => {
			if (isLimitBuyMode) {
				let multiplier = new BigNumber(1);
				if (baseAsset && quoteAsset) {
					multiplier = getMultipler(baseAsset.decimal, quoteAsset.decimal);
				}
				takerAmount = takerAmount.div(multiplier);

				if (orderBookHook.orderBook.asks.length != 0) {
					let {orders, filledAmount} = (
						orderBookHook.orderBook.asks.reduceRight((acc, ask) => (
							acc.filledAmount.comparedTo(takerAmount) != -1 ? acc : (
								((orderFilledAmount = ask.order.remainingFillableTakerAmount.div(ask.order.unitPrice)) => (
									acc.filledAmount = acc.filledAmount.plus(orderFilledAmount),
									acc.orders.push({ order: ask, filledAmount: orderFilledAmount}),
									acc
								))()
							)
						), {orders: [] as {order: OrderBookSingleOrder; filledAmount: BigNumber;}[], filledAmount: new BigNumber(0)})
					);
					if (orders.length != 0 && filledAmount.comparedTo(takerAmount) != -1) {
						let order = orders[orders.length - 1];
						order.filledAmount = order.filledAmount.minus(filledAmount).plus(takerAmount)
					}
					orders.forEach(order => order.filledAmount = order.filledAmount.multipliedBy(order.order.order.unitPrice));
					setTakerFillableOrders(orders);
				}
			} else {
				if (orderBookHook.orderBook.bids.length != 0) {
					let {orders, filledAmount} = (
						orderBookHook.orderBook.bids.reduce((acc, bid) => (
							acc.filledAmount.comparedTo(takerAmount) != -1 ? acc : (
								((orderFilledAmount = bid.order.remainingFillableTakerAmount) => (
									acc.filledAmount = acc.filledAmount.plus(bid.order.remainingFillableTakerAmount),
									acc.orders.push({order: bid, filledAmount: orderFilledAmount}),
									acc
								))()
							)
						), {orders: [] as {order: OrderBookSingleOrder; filledAmount: BigNumber;}[], filledAmount: new BigNumber(0)})
					);
					if (orders.length != 0 && filledAmount.comparedTo(takerAmount) != -1) {
						let order = orders[orders.length - 1];
						order.filledAmount = order.filledAmount.minus(filledAmount).plus(takerAmount)
					}
					setTakerFillableOrders(orders);
				}
			}
		})()
	}, [takerFilledAmount, orderBookHook.orderBook, isLimitBuyMode]);

	const formatAssetDecimal = (amount: BigNumber, asset: CoinData, digit: number): BigNumber => {
		if (amount === undefined) return new BigNumber(0)
		let reduced = amount.multipliedBy(new BigNumber(Math.pow(10, -asset.decimal)))
		if (digit >= 0) {
			let reducedWithRoundDigit = reduced.toFixed(digit)
			let reducedActualNumber = Number(reducedWithRoundDigit)
			return new BigNumber(reducedActualNumber);
		} else {
			return reduced
		}
	}

	const init0xContract = async (_chainId: number) => {
		const w3provider = await detectEthereumProvider() as Web3JsProvider
		const providerEngine = new MetamaskSubprovider(w3provider)
		const contractWrappers = new ContractWrappers(providerEngine, { chainId: _chainId })
		setWeb3Provider(w3provider)
		setContractWrappers(contractWrappers)
		return {
			w3provider,
			contractWrappers
		}
	}

	const getUserBalance = async (_contractWrappers: ContractWrappers, walletAccount: string, _quoteAsset: CoinData, _baseAsset: CoinData) => {
		if (_quoteAsset.currentChainData === undefined || _baseAsset.currentChainData === undefined) {
			return alert("0x Asset not found on current chain.")
		}
	
		const _quoteBalanceAndAllowance = await _contractWrappers.devUtils.getBalanceAndAssetProxyAllowance(walletAccount, _quoteAsset?.currentChainData?.assetData).callAsync()
		const _baseBalanceAndAllowance = await _contractWrappers.devUtils.getBalanceAndAssetProxyAllowance(walletAccount, _baseAsset?.currentChainData?.assetData).callAsync()
		setQuoteAssetBalance(_quoteBalanceAndAllowance[0])
		setQuoteAssetAllowance(_quoteBalanceAndAllowance[1])
		
		setBaseAssetBalance(_baseBalanceAndAllowance[0])
		setBaseAssetAllowance(_baseBalanceAndAllowance[1])
		console.log("_quotebalance", _quoteBalanceAndAllowance[0].toString())
		console.log("_quoteAllow", _quoteBalanceAndAllowance[1].toString())

		console.log("_basebalance", _baseBalanceAndAllowance[0].toString())
		console.log("_baseAllow", _baseBalanceAndAllowance[1].toString())

	}

	const setAllowance = async (_account: string, coin: CoinData, amount: number) => {
		try {
			if (coin.currentChainData === undefined || !baseAsset || baseAsset.currentChainData === undefined) {
				return alert('can not detect quote Asset in current Chain')
			}

			const w3provider = await detectEthereumProvider() as Web3JsProvider
			const providerEngine = new MetamaskSubprovider(w3provider)

			const CoinCcontract = new ERC20TokenContract(coin.currentChainData.address, providerEngine, { from: _account })
			// console.log("CoinCcontract", CoinCcontract)
			const tx = await CoinCcontract
				.approve('0xdef1c0ded9bec7f1a1670819833240f027b25eff', new BigNumber(amount))
				.sendTransactionAsync({ from: _account, gas: 50000 })
			console.log("tx", tx)
		} catch (error) {
			console.error("allowance error", error)
		}
	}

	const initWidgetData = async (_chainId: string, _account: string/*, orderBookHook: OrderBookHook*/) => {
		const processedChainID = parseInt(_chainId, 16)
		const _baseAsset = ERC20TokenList.find(coin => coin.name === assetBase);
		const _quoteAsset = ERC20TokenList.find(coin => coin.name === assetQuote);
		if (_baseAsset && _quoteAsset) {
			let quoteAssetchainData = _quoteAsset.chains.find(e => e.chainId === processedChainID)
			let baseAssetChainData = _baseAsset.chains.find(e => e.chainId === processedChainID)
	
			if (quoteAssetchainData) {
				_quoteAsset.currentChainData = quoteAssetchainData
			}
	
			if (baseAssetChainData) {
				_baseAsset.currentChainData = baseAssetChainData
			}
			
			setQuoteAsset(_quoteAsset)
			setBaseAsset(_baseAsset)
		} else {
			throw new Error('initWidgetData');
		}
	}

	const limitOrderCoinToMesh = async (_chainId: string, _contractWrappers: ContractWrappers, _web3Provider: Web3JsProvider, walletAccount: string, makerToken: CoinData, makeAmount: BigNumber, takerToken: CoinData, takeAmount: BigNumber, side: 'buy' | 'sell') => {
		if (makerToken?.currentChainData === undefined || takerToken?.currentChainData === undefined) {
			return alert('can not detect Asset in current Chain')
		}
		
		const processedChainID = parseInt(_chainId, 16)
		const providerEngine = new MetamaskSubprovider(_web3Provider)
		
		const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"
		// const salt = "88410672309418223763063734186784192419437623032853622266677289218392648131474"
		let takerTokenFeeAmount = side === 'buy' ? new BigNumber(0) : takeAmount.multipliedBy(feePercentage);
		let feeRecipient = side === 'buy' ? NULL_ADDRESS : globalFeeRecipient;
		
		const salt = await generatePseudoRandomSalt()
		let orderData = {
			takerTokenFeeAmount: takerTokenFeeAmount,
			sender: NULL_ADDRESS,
			feeRecipient: feeRecipient,
			makerToken: makerToken.currentChainData.address,
			takerToken: takerToken.currentChainData.address,
			makerAmount: makeAmount,
			takerAmount: takeAmount,
			maker: walletAccount,
			taker: NULL_ADDRESS,
			pool: NULL_ADDRESS,
			expiry: new BigNumber(new BigNumber(Date.now()).div(new BigNumber(1e3)).plus(new BigNumber(182.5 * 24 * 60 * 60)).toFixed(0)),
			verifyingContract: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
			salt: salt,
			chainId: processedChainID,
		}
		const order = new utils.LimitOrder(orderData)
		
		const signature = await order.getSignatureWithProviderAsync(
			providerEngine,
			utils.SignatureType.EIP712
		);
		console.log("order", order)
		console.log("signature", signature)
		
		await (
			fetch('https://api.0x.org/sra/v4/order', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({
					...orderData,
					signature
				}),
			})
				.then(res => res.json())
				.catch(() => ({}))
				.then(resp => {
					let {validationErrors} = resp;
					if (Array.isArray(validationErrors)) {
						throw new Error(validationErrors.map(_ => _.reason).join(','));
					}
				})
		);
	}

	let fillLimitOrder = (takerAmount: BigNumber) => {
		if (zerox) {
			let orders = takerFillableOrders;
			return (zerox => (
				Promise.all(
					orders
						.map(({order}) => getOrderZeroX(order))
						.map(order => zerox.getLimitOrderInfo(order))
				)
					.then((infos) => {
						orders.forEach((order, i) => {
							if (i < infos.length) {
								let takerAmount = order.order.order.takerAmount;
								let takerFilledAmount = new BigNumber(infos[i].takerTokenFilledAmount.toString());
								let fillableAmount = takerAmount.minus(takerFilledAmount);
								order.filledAmount = BigNumber.min(order.filledAmount, fillableAmount);
							}
						});
					})
					//.then(() => alert(JSON.stringify(orders, null, 2)))
					.then(() => (
						orders
							.filter(({order: {order: {expiry, remainingFillableTakerAmount}}}) => (
								new BigNumber(Date.now()).plus(new BigNumber(10e3)).isLessThan(new BigNumber(expiry)) ||
								remainingFillableTakerAmount.comparedTo(new BigNumber(0)) == 1
							))
					))
					.then(orders => {
						return zerox.batchFillLimitOrders(
							orders.map(({order}) => getOrderZeroX(order)), 
							orders.map(({order}) => order.order.signature), 
							orders.map(({filledAmount}) => filledAmount.decimalPlaces(0).toString()), 
							false, {
								gasLimit: new BigNumber(6e5).multipliedBy(orders.length).toString(),
								gasPrice: gasPrice ? gasPrice.toString() : 0,
							}
						);
					})
			))(zerox);
		}
		return Promise.resolve();
	};
 
	let fillLimitOrder_ = (takerAmount: BigNumber) => {
		if (orderBookHook && zerox) {
			if (isLimitBuyMode) {
				if (orderBookHook.orderBook.asks.length != 0) {
					let {orders, filledAmount} = (
						orderBookHook.orderBook.asks.reduceRight((acc, ask) => (
							acc.filledAmount.comparedTo(takerAmount) != -1 ? acc : (
								((orderFilledAmount = ask.order.remainingFillableTakerAmount.div(ask.order.unitPrice)) => (
									acc.filledAmount = acc.filledAmount.plus(orderFilledAmount),
									acc.orders.push({ order: ask, filledAmount: orderFilledAmount}),
									acc
								))()
							)
						), {orders: [] as {order: OrderBookSingleOrder; filledAmount: BigNumber;}[], filledAmount: new BigNumber(0)})
					);
					if (filledAmount.comparedTo(takerAmount) != -1) {
						let order = orders[orders.length - 1];
						order.filledAmount = order.filledAmount.minus(filledAmount).plus(takerAmount)
					}
					orders.forEach(order => order.filledAmount = order.filledAmount.multipliedBy(order.order.order.unitPrice));
					return (zerox => (
						Promise.all(
							orders
								.map(({order}) => getOrderZeroX(order))
								.map(order => zerox.getLimitOrderInfo(order))
						)
							.then((infos) => {
								orders.forEach((order, i) => {
									if (i < infos.length) {
										let takerAmount = order.order.order.takerAmount;
										let takerFilledAmount = new BigNumber(infos[i].takerTokenFilledAmount.toString());
										let fillableAmount = takerAmount.minus(takerFilledAmount);
										order.filledAmount = BigNumber.min(order.filledAmount, fillableAmount);
									}
								});
							})
							.then(() => alert(JSON.stringify({asks:orders}, null, 2)))
							.then(() => (
								orders
									.filter(({order: {order: {expiry, remainingFillableTakerAmount}}}) => (
										new BigNumber(Date.now()).plus(new BigNumber(10e3)).isLessThan(new BigNumber(expiry)) ||
										remainingFillableTakerAmount.comparedTo(new BigNumber(0)) == 1
									))
							))
							.then(orders => (
								zerox.batchFillLimitOrders(
									orders.map(({order}) => getOrderZeroX(order)), 
									orders.map(({order}) => order.order.signature), 
									orders.map(({filledAmount}) => filledAmount.decimalPlaces(0).toString()), 
									false, {
										gasLimit: new BigNumber(1.5e5).multipliedBy(orders.length).toString()
									}
								)
							))
					))(zerox);
				} else {
					return Promise.reject(new Error('no ask order found'));
				}
			} else {
				if (orderBookHook.orderBook.bids.length != 0) {
					let {orders, filledAmount} = (
						orderBookHook.orderBook.bids.reduce((acc, bid) => (
							acc.filledAmount.comparedTo(takerAmount) != -1 ? acc : (
								((orderFilledAmount = bid.order.remainingFillableTakerAmount) => (
									acc.filledAmount = acc.filledAmount.plus(bid.order.remainingFillableTakerAmount),
									acc.orders.push({order: bid, filledAmount: orderFilledAmount}),
									acc
								))()
							)
						), {orders: [] as {order: OrderBookSingleOrder; filledAmount: BigNumber;}[], filledAmount: new BigNumber(0)})
					);
					if (filledAmount.comparedTo(takerAmount) != -1) {
						let order = orders[orders.length - 1];
						order.filledAmount = order.filledAmount.minus(filledAmount).plus(takerAmount)
					}
					return (zerox => (
						Promise.all(
							orders
								.map(({order}) => getOrderZeroX(order))
								.map(order => zerox.getLimitOrderInfo(order))
						)
							.then((infos) => {
								orders.forEach((order, i) => {
									if (i < infos.length) {
										let takerAmount = order.order.order.takerAmount;
										let takerFilledAmount = new BigNumber(infos[i].takerTokenFilledAmount.toString());
										let fillableAmount = takerAmount.minus(takerFilledAmount);
										order.filledAmount = BigNumber.min(order.filledAmount, fillableAmount);
									}
								});
							})
							.then(() => alert(JSON.stringify({bids:orders}, null, 2)))
							.then(() => (
								orders
									.filter(({order: {order: {expiry, remainingFillableTakerAmount}}}) => (
										new BigNumber(Date.now()).plus(new BigNumber(10e3)).isLessThan(new BigNumber(expiry)) ||
										remainingFillableTakerAmount.comparedTo(new BigNumber(0)) == 1
									))
							))
							.then(orders => (
								zerox.batchFillLimitOrders(
									orders.map(({order}) => getOrderZeroX(order)), 
									orders.map(({order}) => order.order.signature), 
									orders.map(({filledAmount}) => filledAmount.decimalPlaces(0).toString()), 
									false, {
										gasLimit: new BigNumber(1.5e5).multipliedBy(orders.length).toString(),
									}
								)
							))
					))(zerox);
				} else {
					return Promise.reject(new Error('no bid order found'));
				}
			}
		}
		return Promise.resolve();
	};

	useEffect(() => {
		if (chainId && account) {
			initWidgetData(chainId, account);
		}
	}, [chainId, account]);
 
	useEffect(() => {
		if (quoteAsset && baseAsset) {
			let multiplier = getMultipler(baseAsset.decimal, quoteAsset.decimal);
			setQuoteTotalPrice(limitTradeBaseAmount.div(new BigNumber(multiplier)).multipliedBy(quoteUnitPrice));
		}
	}, [quoteUnitPrice, limitTradeBaseAmount, quoteAsset, baseAsset]);

	return { 
		account, 
		quoteAsset, setQuoteAsset, 
		baseAsset, setBaseAsset, 
		quoteAssetBalance, setQuoteAssetBalance,
		baseAssetBalance, setBaseAssetBalance, 
		quoteAssetAllowance, setQuoteAssetAllowance,
		baseAssetAllowance, setBaseAssetAllowance, 
		limitTradeBaseAmount, setLimitBuyBaseAmount, 
		quoteUnitPrice, setQuoteUnitPrice,
		quoteTotalPrice, setQuoteTotalPrice, 
		isLimitBuyMode, setLimitBuyMode: setIsLimitBuyMode,
		toggleLimitBuyMode: () => setIsLimitBuyMode(!isLimitBuyMode),
		takerFillableOrders,
		totalFillablePrice,
		totalFillableBaseAmount,
		takerTokenFeeAmount,
		setAllowance,
		limitOrderCoinToMesh: () => (
			!chainId || !account || !quoteAsset || !baseAsset ?
			Promise.resolve() :
			init0xContract(parseInt(chainId, 16))
				.then(_ => {
					let side = isLimitBuyMode ? S('buy') : S('sell');
					if (isLimitBuyMode) {
						return limitOrderCoinToMesh(chainId, _.contractWrappers, _.w3provider, account, quoteAsset, quoteTotalPrice, baseAsset, limitTradeBaseAmount, side);
					} else {
						return limitOrderCoinToMesh(chainId, _.contractWrappers, _.w3provider, account, baseAsset, limitTradeBaseAmount, quoteAsset, quoteTotalPrice, side);
					}
				})
		),
		fillLimitOrder,
		formatAssetDecimal,
		updateCurrencyPair: (assetBase: string, assetQuote: string) => {
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
		},
	};
};
export type LimitBuySellHook = ReturnType<typeof useLimitBuySell>;