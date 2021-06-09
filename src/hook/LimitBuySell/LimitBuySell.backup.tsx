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
import ERC20TokenList, { CoinData, CoinPair } from '../erc20Token';

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_UP, DECIMAL_PLACES: 8 });

interface OrderSignature {
	signatureType: number
	r: string
	s: string
	v: number
}
interface OrderDetailData {
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
	remainingFillableTakerAmountInQuoteAsset: BigNumber
	unitPrice: BigNumber
}
interface OrderMetaData {
	orderHash: string
	createdAt: Date
	remainingFillableTakerAmount: number
}
interface OrderBookSingleOrder {
	order: OrderDetailData
	metaData: OrderMetaData
}

export let useLimitBuySell = (assetBase: string, assetQuote: string) => {
	const { account, chainId, status } = useMetaMask()
	const [web3Provider, setWeb3Provider] = useState<Web3JsProvider>()
	const [contractWrappers, setContractWrappers] = useState<ContractWrappers>()

	const [quoteAsset, setQuoteAsset] = useState<CoinData>()
	const [baseAsset, setBaseAsset] = useState<CoinData>()
	const [quoteAssetBalance, setQuoteAssetBalance] = useState<BigNumber>()
	const [baseAssetBalance, setBaseAssetBalance] = useState<BigNumber>()
	const [quoteAssetAllowance, setQuoteAssetAllowance] = useState<BigNumber>()
	const [baseAssetAllowance, setBaseAssetAllowance] = useState<BigNumber>()
	const [coinPairLimitInfo, setCoinPairLimitInfo] = useState<CoinPair>()

	const [limitTradeBaseAmount, setLimitBuyBaseAmount] = useState<BigNumber>(new BigNumber(0))
	const [quoteUnitPrice, setQuoteUnitPrice] = useState<BigNumber>(new BigNumber(0))
	const [quoteTotalPrice, setQuoteTotalPrice] = useState<BigNumber>(new BigNumber(0))
	const [bulkOrderBook, setBulkOrderBook] = useState<OrderDetailData[]>([])

	const [isLimitBuyMode, setIsLimitBuyMode] = useState(true)

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

	const getSortedOrderBook = async (_quoteAsset: CoinData, _baseAsset: CoinData) => {
		if (_quoteAsset?.currentChainData === undefined || _baseAsset?.currentChainData === undefined) {
			alert('can not detect quote Asset in current Chain')
			return []
		}

		// 1. get all orders from orderbook of this assetpair
		const orderBookRes = await axios.get('https://api.0x.org/sra/v4/orderbook', {
			params: {
				perPage: 1000,
				quoteToken: _quoteAsset.currentChainData.address,
				baseToken: _baseAsset.currentChainData.address,
			}
		})

		console.log("orderBookRes", orderBookRes.data)

		// 2. sort orderbook with unit price
		let tempOrderBook = orderBookRes.data.asks.records as OrderBookSingleOrder[]
		let sortedOrderBook: OrderDetailData[] = []

		tempOrderBook.map(e => {
			let unitPriceBN = new BigNumber(e.order.takerAmount, 10).div(new BigNumber(e.order.makerAmount), 10).decimalPlaces(8)
			let remainingFillableTakerAmountBN = new BigNumber(e.metaData.remainingFillableTakerAmount, 10)
			let fillableInQuoteAssetBN = unitPriceBN.multipliedBy(remainingFillableTakerAmountBN, 10).decimalPlaces(8)

			sortedOrderBook.push({
				...e.order,
				remainingFillableTakerAmount: remainingFillableTakerAmountBN,
				remainingFillableTakerAmountInQuoteAsset: fillableInQuoteAssetBN,
				unitPrice: unitPriceBN
			})
		})
		// sort from lowest unit price to highest
		sortedOrderBook.sort((a, b) => {
			if (a.unitPrice.comparedTo(b.unitPrice) === -1) {
				return -1
			} else if (b.unitPrice.comparedTo(a.unitPrice) === -1) {
				return 1
			} else return 0
		})

		console.log("sortedOrderBook", sortedOrderBook)
		setBulkOrderBook(sortedOrderBook)
		return sortedOrderBook
	}

	const analyseLimitInfo = async (sortedOrderBook: OrderDetailData[], _quoteAsset: CoinData, _baseAsset: CoinData) => {
		let tempVolumn = new BigNumber(0)
		let tempTotalPrice = new BigNumber(0)

		sortedOrderBook.map(s => {
			// tempVolumn += 1 * s.remainingFillableTakerAmount
			tempVolumn = tempVolumn.plus(s.remainingFillableTakerAmount)
			// tempTotalPrice += s.remainingFillableTakerAmount * s.unitPrice
			tempTotalPrice = tempTotalPrice.plus(s.remainingFillableTakerAmount.multipliedBy(s.unitPrice))
		})
		console.log("tempTotalPrice", tempTotalPrice.toNumber())
		console.log("tempVolumn", tempVolumn.toNumber())
		console.log("averageUnitPrice", tempTotalPrice.div(tempVolumn).toNumber())
		let coinPairData: CoinPair = {
			quoteAsset: _quoteAsset,
			baseAsset: _baseAsset,
			minUnitPrice: sortedOrderBook[0].unitPrice,
			maxUnitPrice: sortedOrderBook[sortedOrderBook.length - 1].unitPrice,
			totalVolumn: tempVolumn,
			// averageUnitPrice:tempTotalPrice / formatAssetDecimal(tempVolumn, _baseAsset, 8)
			averageUnitPrice: tempTotalPrice.div(tempVolumn)
		}

		// console.log("coinPairData", coinPairData)
		setCoinPairLimitInfo(coinPairData)
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

	const initWidgetData = async (_chainId: string, _account: string) => {
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
	
			if (_baseAsset.currentChainData && _quoteAsset.currentChainData) {
				const { w3provider, contractWrappers } = await init0xContract(processedChainID)
				const sortedOrderBook = await getSortedOrderBook(_quoteAsset, _baseAsset)
				analyseLimitInfo(sortedOrderBook, _quoteAsset, _baseAsset)
				await getUserBalance(contractWrappers, _account, _quoteAsset, _baseAsset)
			} else {
				throw new Error("Chain error, can not found the asset");
			}
		} else {
			throw new Error('initWidgetData');
		}
	}

	const limitOrderCoinToMesh = async (_chainId: string, _contractWrappers: ContractWrappers, _web3Provider: Web3JsProvider, walletAccount: string, makerToken: CoinData, makeAmount: BigNumber, takerToken: CoinData, takeAmount: BigNumber) => {
		if (makerToken?.currentChainData === undefined || takerToken?.currentChainData === undefined) {
			return alert('can not detect Asset in current Chain')
		}
		const processedChainID = parseInt(_chainId, 16)
		const providerEngine = new MetamaskSubprovider(_web3Provider)

		const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"
		// const salt = "88410672309418223763063734186784192419437623032853622266677289218392648131474"

		const salt = await generatePseudoRandomSalt()
		let orderData = {
			takerTokenFeeAmount: new BigNumber(0),
			sender: NULL_ADDRESS,
			feeRecipient: NULL_ADDRESS,
			makerToken: makerToken.currentChainData.address,
			takerToken: takerToken.currentChainData.address,
			makerAmount: new BigNumber(makeAmount),
			takerAmount: new BigNumber(takeAmount),
			maker: walletAccount,
			taker: NULL_ADDRESS,
			pool: NULL_ADDRESS,
			expiry: new BigNumber(Date.now() + 3600000),
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

	let fillLimitOrder = () => {};

	useEffect(() => {
		if (chainId !== null && account !== null) {
			initWidgetData(chainId, account)
		}
	}, [chainId, account]);

	useEffect(() => {
		setQuoteTotalPrice(limitTradeBaseAmount.multipliedBy(quoteUnitPrice));
	}, [quoteUnitPrice, limitTradeBaseAmount])

	return { 
		account, 
		quoteAsset, setQuoteAsset, 
		baseAsset, setBaseAsset, 
		quoteAssetBalance, setQuoteAssetBalance,
		baseAssetBalance, setBaseAssetBalance, 
		quoteAssetAllowance, setQuoteAssetAllowance,
		baseAssetAllowance, setBaseAssetAllowance, 
		coinPairLimitInfo, setCoinPairLimitInfo,
		limitTradeBaseAmount, setLimitBuyBaseAmount, 
		quoteUnitPrice, setQuoteUnitPrice,
		quoteTotalPrice, setQuoteTotalPrice, 
		bulkOrderBook, setBulkOrderBook,
		isLimitBuyMode, setLimitBuyMode: setIsLimitBuyMode,
		toggleLimitBuyMode: () => setIsLimitBuyMode(!isLimitBuyMode),
		setAllowance,
		limitOrderCoinToMesh: () => (
			!chainId || !account || !quoteAsset || !baseAsset ?
			Promise.resolve() :
			init0xContract(parseInt(chainId, 16))
				.then(_ => {
					if (isLimitBuyMode) {
						return limitOrderCoinToMesh(chainId, _.contractWrappers, _.w3provider, account, quoteAsset, quoteTotalPrice, baseAsset, limitTradeBaseAmount);
					} else {
						return limitOrderCoinToMesh(chainId, _.contractWrappers, _.w3provider, account, baseAsset, limitTradeBaseAmount, quoteAsset, quoteTotalPrice);
					}
				})
		),
		formatAssetDecimal,
	};
};