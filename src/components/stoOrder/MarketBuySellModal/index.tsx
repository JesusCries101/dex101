import React, { useRef, useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {
    Background,
    ModalWrapper,
    SwapperContainer,
    ModalContent,
    CloseModalButton,
    SwapperField,
    SwapperFieldTopRow,
    SwapperFieldTopRowIn,
    SwapperFieldTopRowInItem,
    SwapperFieldBottomRow,
    SwapperBottomRowLeft,
    SwapperBottomRowMiddle,
    SwapperBottomRowRight,
    SwapperBottomRowRightSpan,
    SwapperBottomRowRightSpanImg,
    SwapperBottomRowRightSpanSymbol,
    SwapButton,
    SwapperPriceRow,
    SwapperPriceRowGrid,
    SwapperPriceRowInFlex,
    SwapperPriceRowInItem
} from './modalStyles';

// import { MarketOrder } from '@0x/protocol-utils'
import { ContractWrappers, ERC20TokenContract, } from '@0x/contract-wrappers';
import detectEthereumProvider from '@metamask/detect-provider';
import { useMetaMask } from 'metamask-react';
import axios from 'axios'
import CSS from 'csstype';
import {
  BigNumber,
  MetamaskSubprovider,
  Web3JsProvider,
  
} from '0x.js';
import ERC20TokenList, { CoinData, CoinPair, CoinSymbol, Get0xBaseUrl, OrderBookSingleOrder, OrderDetailData, OrderSignature, TxStatus } from '../erc20Token';
import { formatAssetToGeneralDecimal, formatAssetToBlockchainDecimal, formatAssetDecimal, SetAllowance, Delay, SetUSDTAllowance, checkTxStatus, swapSTOGasLimitPerTx, GetAllowance, enableLog } from '../commonTools';
import {useZeroX} from '../../../hook/ZeroX'

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_UP, DECIMAL_PLACES:8 })


export const MarketBuySellModal = ({
  showModal,
  setShowModal,
  quoteAssetSymbol,
  baseAssetSymbol,
}:{
  showModal:boolean,
  setShowModal:(x:boolean)=>void,
  quoteAssetSymbol:CoinSymbol
  baseAssetSymbol:CoinSymbol
}) => {

  const modalRef = useRef<HTMLDivElement>(null);


  const animation:CSS.Properties = {
    opacity: (showModal ? 1 : 0) as any,
    // transform: showModal ? translate
  }

  const closeModal = e => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };


  // from Jacky BuyWidget-==
  const { account, chainId, status } = useMetaMask()
  const [web3Provider, setWeb3Provider] = useState<Web3JsProvider>()
  const [contractWrappers, setContractWrappers] = useState<ContractWrappers>()

  const [stableCoin, setStableCoin] = useState<CoinData>()
  const [sto, setSTO] = useState<CoinData>()
  const [quoteAsset, setQuoteAsset] = useState<CoinData>()
  const [baseAsset, setBaseAsset] = useState<CoinData>()
  const [quoteAssetBalance, setQuoteAssetBalance ] = useState<BigNumber>()
  const [baseAssetBalance, setBaseAssetBalance ] = useState<BigNumber>()
  const [quoteAssetAllowance, setQuoteAssetAllowance ] = useState<BigNumber>()
  const [baseAssetAllowance, setBaseAssetAllowance ] = useState<BigNumber>()
  const [coinPairMarketInfo, setCoinPairMarketInfo] = useState<CoinPair>()

  const [bulkTradeBaseAmount, setbulkTradeBaseAmount] = useState<BigNumber>(new BigNumber(0))
  const [bulkTradeQuoteAmount, setbulkTradeQuoteAmount] = useState<BigNumber>(new BigNumber(0))

  const [bulkOrderList, setBulkOrderList] = useState<OrderDetailData[]>([])
  const [bulkOrderListBuyAmount, setBulkOrderListBuyAmount] = useState<BigNumber[]>([])
  const [bulkOrderSortedOrderBook, setBulkOrderSortedOrderBook] = useState<OrderDetailData[]>([])
  const [bulkOrderSignatureList, setBulkOrderSignatureList] = useState<OrderSignature[]>([])

  const [isBuyMode, setIsBuyMode] = useState(true)
  
  const [isUnlockingBaseAsset, setIsUnlockingBaseAsset] = useState(false)
  const [isUnlockingQuoteAsset, setIsUnlockingQuoteAsset] = useState(false)
  const [isSwaping, setIsSwaping] = useState(false)
  const [txId, setTxId] = useState<string>()

  let {gasPrice} = useZeroX();

  const swapQuoteBase = async(_contractWrappers:ContractWrappers, chainId:string, _account:string, _stoToken:CoinData, _StableCoin:CoinData) =>{

    setbulkTradeBaseAmount(new BigNumber(0))
    setbulkTradeQuoteAmount(new BigNumber(0))
    setBulkOrderList([])
    setBulkOrderListBuyAmount([])
    setBulkOrderSortedOrderBook([])
    setBulkOrderSignatureList([])

    let newIsBuyMode = !isBuyMode
    setIsBuyMode(newIsBuyMode)

    const newSortedOrderBook = await getSortedOrderBook(newIsBuyMode, chainId, _StableCoin, _stoToken)
    setBulkOrderSortedOrderBook(newSortedOrderBook)
    analyseMarketInfo(newIsBuyMode, newSortedOrderBook, _StableCoin, _stoToken)
    await getUserBalance(_contractWrappers, _account, _StableCoin, _stoToken)

  }



  useEffect(() => {
    if(chainId !== null && account !== null){
      initWidgetData(chainId, account)
    }
  }, [chainId, account])

  const initWidgetData = async(_chainId:string, _account:string ) =>{

    const processedChainID = parseInt(_chainId,16)

    const _baseAsset = ERC20TokenList.find(e=>e.coinSymbol === baseAssetSymbol)
    const _quoteAsset = ERC20TokenList.find(e=>e.coinSymbol === quoteAssetSymbol)
    if(_baseAsset === undefined || _quoteAsset === undefined){
      return alert("Failed to load assetPair")
    }
    setSTO(_baseAsset)// STO
    setStableCoin(_quoteAsset)// stable

    let quoteAssetchainData = _quoteAsset.chains.find(e=>e.chainId === processedChainID )
    let baseAssetChainData = _baseAsset.chains.find(e=>e.chainId === processedChainID )

    if(quoteAssetchainData){
      _quoteAsset.currentChainData = quoteAssetchainData
    }

    if(baseAssetChainData){
      _baseAsset.currentChainData = baseAssetChainData
    }

    setQuoteAsset(_quoteAsset)
    setBaseAsset(_baseAsset)

    if(_baseAsset.currentChainData === undefined || _quoteAsset.currentChainData === undefined){
        return alert("Chain error, can not found the asset")
    }

    const {w3provider, contractWrappers} = await init0xContract(processedChainID)
    const sortedOrderBook = await getSortedOrderBook(isBuyMode, _chainId, _quoteAsset, _baseAsset)
    analyseMarketInfo(isBuyMode, sortedOrderBook, _quoteAsset, _baseAsset)
    await getUserBalance(contractWrappers, _account, _quoteAsset, _baseAsset)
  }
  const init0xContract = async(_chainId:number) =>{
    const w3provider = await detectEthereumProvider() as Web3JsProvider
    const providerEngine = new MetamaskSubprovider(w3provider)
    const contractWrappers = new ContractWrappers(providerEngine,{chainId:_chainId})
    setWeb3Provider(w3provider)
    setContractWrappers(contractWrappers)
    return {
      w3provider,
      contractWrappers
    }
  }
  const getUserBalance = async(_contractWrappers:ContractWrappers, walletAccount:string,  _quoteAsset:CoinData, _baseAsset:CoinData) =>{
    try {
      if(_contractWrappers === undefined){
        return alert("0x ContractWrappers not found.")
      }
      if(_quoteAsset === undefined || _baseAsset === undefined){
        return alert("0x Asset not found.")
      }
      if(_quoteAsset.currentChainData === undefined || _baseAsset.currentChainData === undefined){
        return alert("0x Asset not found on current chain.")
      }
      
      
      // [balance:BigNumber, allowance:BigNumber]
      const batchBalance = await _contractWrappers.devUtils.getBatchBalances(walletAccount, [_quoteAsset?.currentChainData?.assetData,  _baseAsset?.currentChainData?.assetData]).callAsync()
      setQuoteAssetBalance(batchBalance[0])
      setBaseAssetBalance(batchBalance[1])
      
      const _baseAssetAllowance = await GetAllowance(walletAccount, _baseAsset) as BigNumber
      const _quoteAssetAllowance = await GetAllowance(walletAccount, _quoteAsset) as BigNumber
      setQuoteAssetAllowance(_quoteAssetAllowance )
      setBaseAssetAllowance(_baseAssetAllowance)
  
      enableLog && console.log("_quotebalance", batchBalance[0].toString())
      enableLog && console.log("_quoteAllow", _quoteAssetAllowance.toString())
  
      enableLog && console.log("_basebalance", batchBalance[1].toString())
      enableLog && console.log("_baseAllow", _baseAssetAllowance.toString())
    } catch (error) {
      console.error("getUserBalance error", error)
    }
  }

  const getSortedOrderBook = async(_isBuyMode:boolean, _chainId:string, _quoteAsset:CoinData, _baseAsset:CoinData) =>{

    const processedChainID = parseInt(_chainId,16)

    if(_quoteAsset?.currentChainData === undefined || _baseAsset?.currentChainData === undefined){
      alert('can not detect quote Asset in current Chain')
      return []
    } 

    // 1. get all orders from orderbook of this assetpair
    const orderBookRes = await axios.get(`${Get0xBaseUrl(processedChainID)}/sra/v4/orderbook`,{
        params:{
            perPage:1000,
            quoteToken:_quoteAsset.currentChainData.address,
            baseToken:_baseAsset.currentChainData.address,
        }
    })

    enableLog && console.log("orderBookRes", orderBookRes.data)

    // 2. sort orderbook with unit price
    let tempOrderBook: OrderBookSingleOrder[] = []
    let sortedOrderBook:OrderDetailData[] = []

    if(_isBuyMode){
      enableLog && console.log("_isBuyMode orderBookRes")
      tempOrderBook = orderBookRes.data.asks.records as OrderBookSingleOrder[]
      tempOrderBook.map(e=>{
        e.order.expiry = new BigNumber(e.order.expiry)
        let divider = new BigNumber(1000)
        if(e.order.expiry.isGreaterThan(new BigNumber(Date.now()).dividedBy(divider))){
          // Maker: STO, Taker: Stable
          // unitPriceBN = # Stable Coin to buy 1 STO
          let unitPriceBN = formatAssetToGeneralDecimal(new BigNumber(e.order.takerAmount),_quoteAsset).dividedBy(formatAssetToGeneralDecimal(new BigNumber(e.order.makerAmount),_baseAsset))
          let remainingFillableTakerAmountBN = formatAssetToGeneralDecimal(new BigNumber(e.metaData.remainingFillableTakerAmount), _quoteAsset)
          let remainingFillableTakerAmountInMakerAssetBN = remainingFillableTakerAmountBN.dividedBy(unitPriceBN)
          sortedOrderBook.push({
              ...e.order,
              remainingFillableTakerAmount: remainingFillableTakerAmountBN,
              remainingFillableTakerAmountInMakerAsset: remainingFillableTakerAmountInMakerAssetBN,
              unitPrice:unitPriceBN 
          })

          enableLog && console.log("unitPrice",unitPriceBN.toString())
          enableLog && console.log("remainingFillableTakerAmountBN",remainingFillableTakerAmountBN.toString())
          enableLog && console.log("remainingFillableTakerAmountInMakerAsset",remainingFillableTakerAmountInMakerAssetBN.toString())
        }
      })
      // sort from lowest unit price to highest
      sortedOrderBook.sort((a,b)=>{
        if(a.unitPrice.comparedTo(b.unitPrice) === -1){
            return -1
        }else if(b.unitPrice.comparedTo(a.unitPrice) === -1){
            return 1
        }else return 0
      })
    }else{
      enableLog && console.log("SellMode orderBookRes")
      tempOrderBook = orderBookRes.data.bids.records as OrderBookSingleOrder[]
      tempOrderBook.map(e=>{
        // Maker: Stable, Taker: STO
        // unitPriceBN = # Stable Coin for sell 1 STO
        let unitPriceBN = formatAssetToGeneralDecimal(new BigNumber(e.order.makerAmount),_quoteAsset).dividedBy(formatAssetToGeneralDecimal(new BigNumber(e.order.takerAmount),_baseAsset))
        let remainingFillableTakerAmountBN = formatAssetToGeneralDecimal(new BigNumber(e.metaData.remainingFillableTakerAmount), _baseAsset)
        let remainingFillableTakerAmountInMakerAssetBN = remainingFillableTakerAmountBN.multipliedBy(unitPriceBN)

        sortedOrderBook.push({
            ...e.order,
            remainingFillableTakerAmount: remainingFillableTakerAmountBN,
            remainingFillableTakerAmountInMakerAsset: remainingFillableTakerAmountInMakerAssetBN,
            unitPrice:unitPriceBN
        })
        enableLog && console.log("unitPrice",unitPriceBN.toString())
        enableLog && console.log("remainingFillableTakerAmountBN",remainingFillableTakerAmountBN.toString())
        enableLog && console.log("remainingFillableTakerAmountInMakerAsset",remainingFillableTakerAmountInMakerAssetBN.toString())
      })
      // sort from highest unit price to lowest
      sortedOrderBook.sort((a,b)=>{
        if(a.unitPrice.comparedTo(b.unitPrice) === 1){
            return -1
        }else if(b.unitPrice.comparedTo(a.unitPrice) === 1){
            return 1
        }else return 0
      })
    }

    enableLog && console.log("sortedOrderBook", sortedOrderBook)
    setBulkOrderSortedOrderBook(sortedOrderBook)
    return sortedOrderBook

  }
  
  const analyseMarketInfo = async (_isBuyMode:boolean, sortedOrderBook:OrderDetailData[], _quoteAsset:CoinData, _baseAsset:CoinData) =>{
    if(sortedOrderBook === undefined){
        return alert('sortedOrderBook not found')
    }
    // find min, max, average, total volumn
    // cal vol
    let tempQuoteVolumn = new BigNumber(0)
    let tempBaseVolumn = new BigNumber(0)
    let averageUnitPrice = new BigNumber(0)

    sortedOrderBook.map(s=>{
      if(_isBuyMode){
        tempQuoteVolumn = tempQuoteVolumn.plus(formatAssetToGeneralDecimal(new BigNumber(s.takerAmount),_quoteAsset))
        tempBaseVolumn = tempBaseVolumn.plus(formatAssetToGeneralDecimal(new BigNumber(s.makerAmount),_baseAsset))
        averageUnitPrice = tempQuoteVolumn.dividedBy(tempBaseVolumn)
      }else{
        tempBaseVolumn = tempBaseVolumn.plus(formatAssetToGeneralDecimal(new BigNumber(s.takerAmount),_baseAsset))
        tempQuoteVolumn = tempQuoteVolumn.plus(formatAssetToGeneralDecimal(new BigNumber(s.makerAmount),_quoteAsset))
        averageUnitPrice = tempQuoteVolumn.dividedBy(tempBaseVolumn)
      }
    })
    enableLog && console.log("tempBaseVolumn",tempBaseVolumn.toNumber())
    enableLog && console.log("tempQuoteVolumn",tempQuoteVolumn.toNumber())
    enableLog && console.log("averageUnitPrice",averageUnitPrice.toNumber())
    let coinPairData:CoinPair = {
        quoteAsset:_quoteAsset,
        baseAsset:_baseAsset,
        minUnitPrice: sortedOrderBook.length > 0 ?  sortedOrderBook[0].unitPrice : new BigNumber(0),
        maxUnitPrice: sortedOrderBook.length > 0 ? sortedOrderBook[sortedOrderBook.length - 1].unitPrice : new BigNumber(0),
        totalQuoteVolumn:tempQuoteVolumn,
        totalBaseVolumn:tempBaseVolumn,
        averageUnitPrice: sortedOrderBook.length > 0 ? averageUnitPrice : new BigNumber(0), 
        numberOfOrders:sortedOrderBook.length
    }
    setCoinPairMarketInfo(coinPairData)
  }

  const BulkMarketBuyCoinFromMesh = async (_contractWrappers:ContractWrappers, chainId:string, walletAccount:string, tradeBaseAmount:BigNumber, tradeQuoteAmount:BigNumber, dryrun:boolean) =>{
    if(quoteAsset?.currentChainData === undefined || baseAsset?.currentChainData === undefined){
        return alert('can not detect quote Asset in current Chain')
    }
    enableLog && console.log("tradeBaseAmount", tradeBaseAmount)
    enableLog && console.log("tradeQuoteAmount", tradeQuoteAmount)
    let sortedOrderBook:OrderDetailData[] = []

    // 1. get all orders from orderbook of this assetpair, or get local cache
    if(!dryrun){
      sortedOrderBook = await getSortedOrderBook(isBuyMode, chainId, quoteAsset, baseAsset)
    }else{
      // use local cache
      sortedOrderBook = bulkOrderSortedOrderBook
    }

    // 3. extract all orders from data array
    let orderList:OrderDetailData[] = []
    let signatureList:OrderSignature[] = []
    let takerAmountList:BigNumber[] = []
    let totalOrders = sortedOrderBook.length
    

    if(tradeBaseAmount.isEqualTo(new BigNumber(0))){
      enableLog && console.log("Quote by Quote Amount")

      let tempTotalGet = new BigNumber(0)
      let totalTakeQuoteFromOrder = new BigNumber(0)
      totalTakeQuoteFromOrder = tradeQuoteAmount
      enableLog && console.log("totalTakeQuoteFromOrder", totalTakeQuoteFromOrder.toNumber())
      
      for(let i = 0; i < totalOrders; i++){
        let order = sortedOrderBook[i]
        enableLog && console.log("order.remainingFillableTakerAmount", order.remainingFillableTakerAmount.toString())

        if(totalTakeQuoteFromOrder.isGreaterThanOrEqualTo(order.unitPrice)){
          if(order.remainingFillableTakerAmount.comparedTo(totalTakeQuoteFromOrder) === -1){
            orderList.push(order)
            signatureList.push(order.signature)
            takerAmountList.push(formatAssetToBlockchainDecimal(order.remainingFillableTakerAmount, quoteAsset))
            
            enableLog && console.log("order.unitPrice", order.unitPrice.toString())
            tempTotalGet = tempTotalGet.plus(order.remainingFillableTakerAmountInMakerAsset)
            enableLog && console.log("tempTotalGet", tempTotalGet.toString())
            totalTakeQuoteFromOrder = totalTakeQuoteFromOrder.minus(order.remainingFillableTakerAmount)
            enableLog && console.log("totalTakeQuoteFromOrder After", totalTakeQuoteFromOrder.toString())
          }else{
              orderList.push(order)
              signatureList.push(order.signature)
              
              let numberOfMakerTokenCanBuy = totalTakeQuoteFromOrder.dividedBy(order.unitPrice).decimalPlaces(0,BigNumber.ROUND_DOWN)
              let quoteActualPayForValidBase = numberOfMakerTokenCanBuy.multipliedBy(order.unitPrice)
              let moneyExceed = totalTakeQuoteFromOrder.minus(quoteActualPayForValidBase)

              enableLog && console.log("moneyExceed", moneyExceed.toString())
              enableLog && console.log("numberOfMakerTokenCanBuy", numberOfMakerTokenCanBuy.toString())

              takerAmountList.push(formatAssetToBlockchainDecimal(quoteActualPayForValidBase, quoteAsset))
              // enableLog && console.log("order.unitPrice", order.unitPrice.toNumber())
              // enableLog && console.log("totalTakeQuoteFromOrder", totalTakeQuoteFromOrder.toString())
              enableLog && console.log("order.unitPrice", order.unitPrice.toString())
              tempTotalGet = tempTotalGet.plus(numberOfMakerTokenCanBuy)
              enableLog && console.log("tempTotalGet", tempTotalGet.toString())
              
              // remain not used
              totalTakeQuoteFromOrder = moneyExceed
              break
          }
        }

      }
  
      // setBulkBuyActualPayAmount(tempTotalPay)
      setbulkTradeBaseAmount(tempTotalGet.decimalPlaces(baseAsset.decimal))

      let tempActualPayQuote = tradeQuoteAmount.minus(totalTakeQuoteFromOrder)

      setbulkTradeQuoteAmount(tempActualPayQuote.decimalPlaces(quoteAsset.decimal))
  
      setBulkOrderList(orderList)
      setBulkOrderListBuyAmount(takerAmountList)
      setBulkOrderSignatureList(signatureList)
    }else{
      
      enableLog && console.log("Quote by Base Amount")
      // calculate by take amount, which use quoteAsset
      let tempTotalPay = new BigNumber(0)
      let totalMakeBaseFromOrder = new BigNumber(0)
      let tempTotalGetBaseToken = new BigNumber(0)

      totalMakeBaseFromOrder = tradeBaseAmount.decimalPlaces(baseAsset.decimal)
      
      for(let i = 0; i < totalOrders; i++){
        let order = sortedOrderBook[i]
        if(order.remainingFillableTakerAmountInMakerAsset.comparedTo(totalMakeBaseFromOrder) === -1){
          orderList.push(order)
          signatureList.push(order.signature)
          takerAmountList.push(formatAssetToBlockchainDecimal(order.remainingFillableTakerAmount, quoteAsset))
          enableLog && console.log("order.unitPrice", order.unitPrice.toString())
          tempTotalGetBaseToken = tempTotalGetBaseToken.plus(order.remainingFillableTakerAmountInMakerAsset)
          enableLog && console.log("tempTotalGetBaseToken", tempTotalGetBaseToken.toString())
          tempTotalPay = tempTotalPay.plus(order.remainingFillableTakerAmount)
          enableLog && console.log("tempTotalPay", tempTotalPay.toString())
          enableLog && console.log("totalMakeBaseFromOrder", totalMakeBaseFromOrder.toString())
          totalMakeBaseFromOrder = totalMakeBaseFromOrder.minus(order.remainingFillableTakerAmountInMakerAsset)
          enableLog && console.log("totalMakeBaseFromOrder After", totalMakeBaseFromOrder.toString())
        }else{
          let totalNeedQuoteFromOrder = totalMakeBaseFromOrder.multipliedBy(order.unitPrice).decimalPlaces(quoteAsset.decimal)
          enableLog && console.log("totalNeedQuoteFromOrder", totalNeedQuoteFromOrder.toString())
          orderList.push(order)
          signatureList.push(order.signature)
          tempTotalGetBaseToken = tempTotalGetBaseToken.plus(totalMakeBaseFromOrder)
          enableLog && console.log("tempTotalGetBaseToken", tempTotalGetBaseToken.toString())
          takerAmountList.push(formatAssetToBlockchainDecimal(totalNeedQuoteFromOrder, quoteAsset))
          tempTotalPay = tempTotalPay.plus(totalNeedQuoteFromOrder)
          enableLog && console.log("tempTotalPay", tempTotalPay.toString())
          totalMakeBaseFromOrder = new BigNumber(0)
          break
        }
      }
  

      setbulkTradeQuoteAmount(tempTotalPay.decimalPlaces(quoteAsset.decimal))
      setbulkTradeBaseAmount(tempTotalGetBaseToken.decimalPlaces(baseAsset.decimal))

  
      setBulkOrderList(orderList)
      setBulkOrderListBuyAmount(takerAmountList)
      setBulkOrderSignatureList(signatureList)
    }

    if(!dryrun){
      if(_contractWrappers === undefined)return alert("0x Contract not found.")
      const res = await _contractWrappers.exchangeProxy.batchFillLimitOrders(orderList, signatureList,takerAmountList, false)
      .sendTransactionAsync({
          from:walletAccount,
          gas:swapSTOGasLimitPerTx * orderList.length,
          gasPrice: gasPrice ? gasPrice.toString() : 0
      },
      {
          shouldValidate:true
      }).catch(e=>console.error("e", e))
      // update market data
      if(quoteAsset !== undefined && baseAsset !== undefined){
        const sortedOrderBook = await getSortedOrderBook(isBuyMode, chainId, quoteAsset, baseAsset)
        analyseMarketInfo(isBuyMode, sortedOrderBook, quoteAsset, baseAsset)
      }
    }
  }

  const BulkMarketSellCoinFromMesh = async (_contractWrappers:ContractWrappers, _chainId:string , walletAccount:string, tradeBaseAmount:BigNumber, tradeQuoteAmount:BigNumber, dryrun:boolean) =>{
    if(quoteAsset?.currentChainData === undefined || baseAsset?.currentChainData === undefined){
        return alert('can not detect quote Asset in current Chain')
    }
    enableLog && console.log("tradeBaseAmount", tradeBaseAmount)
    enableLog && console.log("tradeQuoteAmount", tradeQuoteAmount)
    let sortedOrderBook:OrderDetailData[] = []

    // 1. get all orders from orderbook of this assetpair, or get local cache
    if(!dryrun){
      sortedOrderBook = await getSortedOrderBook(isBuyMode, _chainId, quoteAsset, baseAsset)
    }else{
      // use local cache
      sortedOrderBook = bulkOrderSortedOrderBook
    }

    // 3. extract all orders from data array
    let orderList:OrderDetailData[] = []
    let signatureList:OrderSignature[] = []
    let takerAmountList:BigNumber[] = []
    let totalOrders = sortedOrderBook.length
    

    if(tradeBaseAmount.isEqualTo(new BigNumber(0))){
      enableLog && console.log("Quote by Quote Amount")
      let tempTotalPayBase = new BigNumber(0)
      let tempTotalGetQuote = new BigNumber(0)
      let totalMakeQuoteFromOrder = new BigNumber(0)
      totalMakeQuoteFromOrder = tradeQuoteAmount.decimalPlaces(quoteAsset.decimal)
      enableLog && console.log("totalMakeQuoteFromOrder", totalMakeQuoteFromOrder.toNumber())
      
      for(let i = 0; i < totalOrders; i++){
        let order = sortedOrderBook[i]
        
        enableLog && console.log("order.remainingFillableTakerAmount", order.remainingFillableTakerAmountInMakerAsset.toString())
        if(order.remainingFillableTakerAmountInMakerAsset.comparedTo(totalMakeQuoteFromOrder) === -1){
          orderList.push(order)
          signatureList.push(order.signature)
          takerAmountList.push(order.remainingFillableTakerAmount)
          tempTotalGetQuote = tempTotalGetQuote.plus(order.remainingFillableTakerAmountInMakerAsset)
          tempTotalPayBase = tempTotalPayBase.plus(order.remainingFillableTakerAmount)
          totalMakeQuoteFromOrder = totalMakeQuoteFromOrder.minus(order.remainingFillableTakerAmountInMakerAsset)
        }else{

          let numberOfTakerTokenCanSell = totalMakeQuoteFromOrder.dividedBy(order.unitPrice).decimalPlaces(baseAsset.decimal,BigNumber.ROUND_DOWN)
          if(numberOfTakerTokenCanSell.isGreaterThan(new BigNumber(0))){
            orderList.push(order)
            signatureList.push(order.signature)
            let quoteActualPayForValidBase = numberOfTakerTokenCanSell.multipliedBy(order.unitPrice)
            let moneyExceed = totalMakeQuoteFromOrder.minus(quoteActualPayForValidBase)
  
            enableLog && console.log("moneyExceed", moneyExceed.toString())
            enableLog && console.log("numberOfTakerTokenCanSell", numberOfTakerTokenCanSell.toString())
            takerAmountList.push(formatAssetToBlockchainDecimal(numberOfTakerTokenCanSell, baseAsset))
            enableLog && console.log("order.unitPrice", order.unitPrice.toString())
            tempTotalGetQuote = tempTotalGetQuote.plus(quoteActualPayForValidBase)
            tempTotalPayBase = tempTotalPayBase.plus(numberOfTakerTokenCanSell)
            enableLog && console.log("tempTotalGetQuote", tempTotalGetQuote.toString())
            enableLog && console.log("tempTotalPayBase", tempTotalPayBase.toString())
            totalMakeQuoteFromOrder = moneyExceed
          }
          break
        }
      }
  
      setbulkTradeBaseAmount(tempTotalPayBase.decimalPlaces(baseAsset.decimal))

      let tempActualPayQuote = tradeQuoteAmount.minus(totalMakeQuoteFromOrder)

      setbulkTradeQuoteAmount(tempTotalGetQuote.decimalPlaces(quoteAsset.decimal))
  
      setBulkOrderList(orderList)
      setBulkOrderListBuyAmount(takerAmountList)
      setBulkOrderSignatureList(signatureList)
    }else{
      
      enableLog && console.log("Quote by Base Amount")
      // calculate by take amount, which use quoteAsset

      let tempTotalBasePay = new BigNumber(0)
      let totalTakeBaseFromOrder = new BigNumber(0)
      let tempTotalQuoteGet = new BigNumber(0)
      totalTakeBaseFromOrder = tradeBaseAmount.decimalPlaces(baseAsset.decimal)
      
      for(let i = 0; i < totalOrders; i++){
        let order = sortedOrderBook[i]
        enableLog && console.log("order.remainingFillableTakerAmount", order.remainingFillableTakerAmount.toString())
        if(order.remainingFillableTakerAmount.comparedTo(totalTakeBaseFromOrder) === -1){
          orderList.push(order)
          signatureList.push(order.signature)
          takerAmountList.push(formatAssetToBlockchainDecimal(order.remainingFillableTakerAmount,baseAsset))
          tempTotalBasePay = tempTotalBasePay.plus(order.remainingFillableTakerAmount)
          tempTotalQuoteGet = tempTotalQuoteGet.plus(order.remainingFillableTakerAmountInMakerAsset)
          totalTakeBaseFromOrder = totalTakeBaseFromOrder.minus(order.remainingFillableTakerAmount)
          
        }else{
          orderList.push(order)
          signatureList.push(order.signature)
          takerAmountList.push(formatAssetToBlockchainDecimal(totalTakeBaseFromOrder,baseAsset))
          // enableLog && console.log("order.unitPrice", order.unitPrice.toNumber())
          enableLog && console.log("totalTakeBaseFromOrder", totalTakeBaseFromOrder.toString())
          enableLog && console.log("order.unitPrice", order.unitPrice.toString())
          tempTotalBasePay = tempTotalBasePay.plus(totalTakeBaseFromOrder)
          enableLog && console.log("tempTotalBasePay", tempTotalBasePay.toString())
          tempTotalQuoteGet = tempTotalQuoteGet.plus(totalTakeBaseFromOrder.multipliedBy(order.unitPrice))
          totalTakeBaseFromOrder = new BigNumber(0)
          break
        }
      }
      setbulkTradeQuoteAmount(tempTotalQuoteGet.decimalPlaces(quoteAsset.decimal))
      setbulkTradeBaseAmount(tempTotalBasePay.decimalPlaces(baseAsset.decimal))
  
      setBulkOrderList(orderList)
      setBulkOrderListBuyAmount(takerAmountList)
      setBulkOrderSignatureList(signatureList)
    }

    if(!dryrun){
      if(_contractWrappers === undefined)return alert("0x Contract not found.")
      const res = await _contractWrappers.exchangeProxy.batchFillLimitOrders(orderList, signatureList,takerAmountList, false)
      .sendTransactionAsync({
          from:walletAccount,
          gas:swapSTOGasLimitPerTx * orderList.length,
          gasPrice: gasPrice ? gasPrice.toString() : 0
      },
      {
          shouldValidate:true
      }).catch(e=>console.error("e", e))
      // update market data
      if(quoteAsset !== undefined && baseAsset !== undefined){
        const sortedOrderBook = await getSortedOrderBook(isBuyMode, _chainId, quoteAsset, baseAsset)
        analyseMarketInfo(isBuyMode, sortedOrderBook, quoteAsset, baseAsset)
      }
    }
  }

  const runTransaction = async(_contractWrappers:ContractWrappers, _chainId:string,  walletAccount:string, orderList:OrderDetailData[], signatureList:OrderSignature[], takerAmountList:BigNumber[]) =>{
    if(_contractWrappers === undefined)return alert("0x Contract not found.")
    if(quoteAsset === undefined || baseAsset === undefined)return alert("0x Asset not found.")
    if(account === undefined)return alert("account not found.")
    try {
      const _txId = await _contractWrappers.exchangeProxy.batchFillLimitOrders(orderList, signatureList,takerAmountList, false)
      .sendTransactionAsync({
          from:walletAccount,
          gas:swapSTOGasLimitPerTx * orderList.length,
          gasPrice: gasPrice ? gasPrice.toString() : 0,
      },
      {
          shouldValidate:true
      }).catch(e=>console.error("e", e))
      // enableLog && console.log("_txId", _txId)

      if(typeof _txId === 'string' ){
        setTxId(_txId)
        setIsSwaping(true)
        while(1){
          const {txStatus, blockNumber} = await checkTxStatus(_txId)
          if(txStatus !== TxStatus.Success){
            enableLog && console.log("still running tx", _txId, txStatus)
            await Delay(10000)
          }else{
            setIsSwaping(false)
            await getUserBalance(_contractWrappers, walletAccount, quoteAsset, baseAsset)
            // setTxId(undefined) // no need to clear so client can check
            alert(`tx ${_txId} finish at block ${blockNumber}`)
            break
          }
        }

        const newSortedOrderBook = await getSortedOrderBook(isBuyMode, _chainId, quoteAsset, baseAsset)
        analyseMarketInfo(isBuyMode, newSortedOrderBook, quoteAsset, baseAsset)
      }
    } catch (error) {
      
    }
  }

  const handleUnlockAsset = async(_acount:string, _coinData:CoinData, _baseAsset:CoinData, _quoteAsset:CoinData) =>{
    try {
      let tx = ''
      if(_coinData.coinSymbol === CoinSymbol.USDT){
        tx = await SetUSDTAllowance(_acount, _coinData, Math.pow(2,50))
      }else{
        tx = await SetAllowance(_acount, _coinData, Math.pow(2,255)) as string
      }
      _coinData.coinSymbol === _baseAsset.coinSymbol ? setIsUnlockingBaseAsset(true) : setIsUnlockingQuoteAsset(true)
      while(1){
        const {txStatus, blockNumber} = await checkTxStatus(tx)
        if(txStatus !== TxStatus.Success){
          enableLog && console.log("still running tx", tx, txStatus)
          await Delay(10000)
        }else{
          _coinData.coinSymbol === _baseAsset.coinSymbol ? setIsUnlockingBaseAsset(false) : setIsUnlockingQuoteAsset(false)
          // setTxId(undefined) // no need to clear so client can check
          alert(`${_coinData.name} Unlock successfully`)
          break
        }
      }
    } catch (error) {
      setIsUnlockingBaseAsset(false)
      setIsUnlockingQuoteAsset(false)
    }
  }

    let withDecimal = (bulkTradeQuoteAmount: BigNumber, decimal: number) => bulkTradeQuoteAmount.multipliedBy(new BigNumber(10).pow(decimal));

    let isBalanceInsufficient = (
      isBuyMode ? (
        quoteAsset && quoteAssetBalance && withDecimal(bulkTradeQuoteAmount, quoteAsset.decimal).isGreaterThan(quoteAssetBalance)
      ) : (
        baseAsset && baseAssetBalance && withDecimal(bulkTradeBaseAmount, baseAsset.decimal).isGreaterThan(baseAssetBalance)
      )
    );

    //========================
    // const renderModal = (state) => {
    //   if (showModal === true) {

    //   } else {
    //       return (
    //         <> </>
    //       )
    //   }
    // }
    if(!showModal){
      return (
        <> </>
      )
    }else if(account === null && showModal === true){
      return (
        <Background>
          {/* <h1>Please connect Metamask</h1> */}
          <animated.div style={{
            opacity: (showModal ? 1 : 0) as any
          }}>
            <ModalWrapper >
              <ModalContent>
                <h1>Please connect Metamask</h1>
              </ModalContent>
              <CloseModalButton
                aria-label='Close modal'
                onClick={() => setShowModal(false)}
              />
            </ModalWrapper>
          </animated.div>
        </Background>
      )
    }else if(contractWrappers === undefined || account === null || quoteAsset === undefined || baseAsset === undefined || chainId === null){
      return (
        <Background>
          {/* <h1>Please connect Metamask</h1> */}
          <animated.div style={{
            opacity: (showModal ? 1 : 0) as any
          }}>
            <ModalWrapper >
              <ModalContent>
                <h1>Loading data from Blockchain</h1>
              </ModalContent>
              <CloseModalButton
                aria-label='Close modal'
                onClick={() => setShowModal(false)}
              />
            </ModalWrapper>
          </animated.div>
        </Background>
      )
    }else if(showModal){
      return (
        <Background onClick={closeModal} ref={modalRef}>
          <animated.div style={{
            opacity: (showModal ? 1 : 0) as any
          }}>
            <ModalWrapper >
              <ModalContent>
                {
                  isBuyMode ?
                  <h1>Buy {baseAsset?.name} Tokens with {quoteAsset?.name}</h1>
                  :
                  <h1>Sell {baseAsset?.name} Tokens for {quoteAsset?.name}</h1>
                }
                
                <SwapperContainer>
                  {
                    isBuyMode ?
                    <>
                      <SwapperField>
                        <SwapperFieldTopRow>
                          <SwapperFieldTopRowIn>
                            <SwapperFieldTopRowInItem>You Pay</SwapperFieldTopRowInItem>
                            {
                              quoteAssetBalance !== undefined && quoteAssetAllowance !== undefined && <SwapperFieldTopRowInItem>Balance: {formatAssetDecimal(quoteAssetBalance?.toNumber(), quoteAsset, quoteAsset.displayDecimal)} {/**| Allowance:  {formatAssetDecimal(quoteAssetAllowance?.toNumber(), quoteAsset, quoteAsset.displayDecimal)} */}</SwapperFieldTopRowInItem>
                            }
                          </SwapperFieldTopRowIn>
                        </SwapperFieldTopRow>
                        <SwapperFieldBottomRow>
                          <SwapperBottomRowLeft type="number" value={bulkTradeQuoteAmount.toNumber()} id="bulkTradeQuoteAmount" step="0.00000001" onChange={e=>setbulkTradeQuoteAmount(new BigNumber((e.currentTarget.value === undefined || e.currentTarget.value === null) ? 0 : Number(Number(e.currentTarget.value).toFixed(quoteAsset.decimal))))}  
                            onBlur={()=>BulkMarketBuyCoinFromMesh(contractWrappers, chainId, account, new BigNumber(0), bulkTradeQuoteAmount.decimalPlaces(quoteAsset.decimal), true)}
                          />
                          {
                            isUnlockingQuoteAsset ? 
                            <SwapperBottomRowMiddle>
                              <Loader
                                // type="Puff"
                                type="ThreeDots"
                                color="#00BFFF"
                                height={50}
                                width={50}
                                timeout={0} //0 secs = forever
                              />
                            </SwapperBottomRowMiddle>
                            :
                            quoteAssetAllowance?.isLessThanOrEqualTo(new BigNumber(0)) ?
                            <SwapperBottomRowMiddle
                              onClick={async()=>{handleUnlockAsset(account, quoteAsset, baseAsset, quoteAsset)}}
                            >Unlock</SwapperBottomRowMiddle>
                            :
                            <>
                            </>
                          }
                          <SwapperBottomRowRight>
                            <SwapperBottomRowRightSpan>
                                <SwapperBottomRowRightSpanImg src={quoteAsset.icon} />
                                <SwapperBottomRowRightSpanSymbol>{quoteAsset?.name}</SwapperBottomRowRightSpanSymbol>
                            </SwapperBottomRowRightSpan>
                          </SwapperBottomRowRight>
                        </SwapperFieldBottomRow>
                      </SwapperField>
                      <SwapperField style={{
                        display:'flex',
                        justifyContent:'center',
                        alignContent:'center',
                        border: 'none'
                      }}>
                        <div style={{
                          fontSize: '24px',
                          cursor: 'pointer'
                        }} onClick={()=>{
                          if(sto && stableCoin){
                            swapQuoteBase(contractWrappers, chainId, account, sto, stableCoin)
                          }
                        }}>⬇️</div>
                      </SwapperField>
                      
                      <SwapperField>
                        <SwapperFieldTopRow>
                          <SwapperFieldTopRowIn>
                            <SwapperFieldTopRowInItem>You Get</SwapperFieldTopRowInItem>
                            {
                              baseAssetBalance !== undefined && baseAssetAllowance !== undefined &&  <SwapperFieldTopRowInItem>Balance: {formatAssetDecimal(baseAssetBalance?.toNumber(), baseAsset, baseAsset.displayDecimal)} {/**| Allowance: {formatAssetDecimal(baseAssetAllowance?.toNumber(), baseAsset, baseAsset.displayDecimal)} */}</SwapperFieldTopRowInItem>
                            }
                          </SwapperFieldTopRowIn>
                        </SwapperFieldTopRow>
                        <SwapperFieldBottomRow>
                          <SwapperBottomRowLeft type="number" value={bulkTradeBaseAmount.toNumber()} id="bulkTradeBaseAmount" onChange={e=>setbulkTradeBaseAmount(new BigNumber((e.currentTarget.value === undefined || e.currentTarget.value === null) ? 0 : Number(Number(e.currentTarget.value).toFixed(baseAsset.decimal))))}  
                            onBlur={()=>BulkMarketBuyCoinFromMesh(contractWrappers, chainId, account, bulkTradeBaseAmount.decimalPlaces(baseAsset.decimal), new BigNumber(0), true)}
                          />
                          {
                            isUnlockingBaseAsset ? 
                            <SwapperBottomRowMiddle>
                              <Loader
                                // type="Puff"
                                type="ThreeDots"
                                color="#00BFFF"
                                height={50}
                                width={50}
                                timeout={0} //0 secs = forever
                              />
                            </SwapperBottomRowMiddle>
                            :
                            baseAssetAllowance?.isLessThanOrEqualTo(new BigNumber(0)) ?
                            <SwapperBottomRowMiddle
                              onClick={async()=>{handleUnlockAsset(account, baseAsset, baseAsset, quoteAsset)}}
                            >Unlock</SwapperBottomRowMiddle>
                            :
                            <>
                            </>
                          }
                          <SwapperBottomRowRight>
                              <SwapperBottomRowRightSpan>
                                  <SwapperBottomRowRightSpanImg src={baseAsset.icon}/>
                                  <SwapperBottomRowRightSpanSymbol>{baseAsset?.name}</SwapperBottomRowRightSpanSymbol>
                              </SwapperBottomRowRightSpan>
                          </SwapperBottomRowRight>
                        </SwapperFieldBottomRow>
                      </SwapperField>
                    </>
                    :
                    <>
                      <SwapperField>
                        <SwapperFieldTopRow>
                          <SwapperFieldTopRowIn>
                            <SwapperFieldTopRowInItem>You Pay</SwapperFieldTopRowInItem>
                            {
                              baseAssetBalance !== undefined && baseAssetAllowance !== undefined &&  <SwapperFieldTopRowInItem>Balance: {formatAssetDecimal(baseAssetBalance?.toNumber(), baseAsset, 8)} {/* | Allowance: {formatAssetDecimal(baseAssetAllowance?.toNumber(), baseAsset, 8)}*/}</SwapperFieldTopRowInItem>
                            }
                          </SwapperFieldTopRowIn>
                        </SwapperFieldTopRow>
                        <SwapperFieldBottomRow>
                          <SwapperBottomRowLeft type="number" value={bulkTradeBaseAmount.toNumber()} id="bulkTradeBaseAmount" step="0.00000001" onChange={e=>setbulkTradeBaseAmount(new BigNumber((e.currentTarget.value === undefined || e.currentTarget.value === null) ? 0 : Number(Number(e.currentTarget.value).toFixed(baseAsset.decimal))))}  
                            onBlur={()=>BulkMarketSellCoinFromMesh(contractWrappers, chainId, account, bulkTradeBaseAmount.decimalPlaces(baseAsset.decimal), new BigNumber(0), true)}
                          />
                          {
                            baseAssetAllowance?.isLessThanOrEqualTo(new BigNumber(0)) ?
                            <SwapperBottomRowMiddle
                              onClick={()=>{handleUnlockAsset(account, baseAsset, baseAsset, quoteAsset)}}
                            >Unlock</SwapperBottomRowMiddle> :
                            <></>
                          }
                          <SwapperBottomRowRight>
                            <SwapperBottomRowRightSpan>
                                <SwapperBottomRowRightSpanImg src={baseAsset.icon} />
                                <SwapperBottomRowRightSpanSymbol>{baseAsset?.name}</SwapperBottomRowRightSpanSymbol>
                            </SwapperBottomRowRightSpan>
                          </SwapperBottomRowRight>
                        </SwapperFieldBottomRow>
                      </SwapperField>
                      <SwapperField style={{
                        display:'flex',
                        justifyContent:'center',
                        alignContent:'center',
                        border: 'none'
                      }}>
                        <div style={{
                          fontSize: '24px',
                          cursor: 'pointer'
                        }} onClick={()=>{
                          if(sto && stableCoin){
                            swapQuoteBase(contractWrappers, chainId, account, sto, stableCoin)
                          }
                        }}>⬇️</div>
                      </SwapperField>
                      
                      <SwapperField>
                        <SwapperFieldTopRow>
                          <SwapperFieldTopRowIn>
                            <SwapperFieldTopRowInItem>You Get</SwapperFieldTopRowInItem>
                            {
                              quoteAssetBalance !== undefined && quoteAssetAllowance !== undefined && <SwapperFieldTopRowInItem>Balance: {formatAssetDecimal(quoteAssetBalance?.toNumber(), quoteAsset, 8)} {/* | Allowance: {formatAssetDecimal(quoteAssetAllowance?.toNumber(), quoteAsset, 8)}*/}</SwapperFieldTopRowInItem>
                            }
                          </SwapperFieldTopRowIn>
                        </SwapperFieldTopRow>
                        <SwapperFieldBottomRow>
                          <SwapperBottomRowLeft type="number" value={bulkTradeQuoteAmount.toNumber()} id="bulkTradeQuoteAmount" onChange={e=>setbulkTradeQuoteAmount(new BigNumber((e.currentTarget.value === undefined || e.currentTarget.value === null) ? 0 : Number(Number(e.currentTarget.value).toFixed(quoteAsset.decimal))))}  
                            onBlur={()=>BulkMarketSellCoinFromMesh(contractWrappers, chainId, account, new BigNumber(0), bulkTradeQuoteAmount.decimalPlaces(quoteAsset.decimal), true)}
                          />
                          {
                            quoteAssetAllowance?.isLessThanOrEqualTo(new BigNumber(0)) ?
                            <SwapperBottomRowMiddle
                              onClick={() => {handleUnlockAsset(account, quoteAsset, baseAsset, quoteAsset)}}
                            >Unlock</SwapperBottomRowMiddle> :
                            <></>
                          }
                          <SwapperBottomRowRight>
                              <SwapperBottomRowRightSpan>
                                  <SwapperBottomRowRightSpanImg src={quoteAsset.icon}/>
                                  <SwapperBottomRowRightSpanSymbol>{quoteAsset?.name}</SwapperBottomRowRightSpanSymbol>
                              </SwapperBottomRowRightSpan>
                          </SwapperBottomRowRight>
                        </SwapperFieldBottomRow>
                      </SwapperField>
                    </>
                  }



                  <SwapperPriceRow>
                    {
                      coinPairMarketInfo && 
                      <SwapperPriceRowGrid>
                        <SwapperPriceRowInFlex>
                            <SwapperPriceRowInItem>{isBuyMode ? "Best ask price" : "Best bid price"}</SwapperPriceRowInItem>
                            <SwapperPriceRowInItem>1 {coinPairMarketInfo?.baseAsset.name} = {coinPairMarketInfo?.minUnitPrice.toFixed(quoteAsset.displayDecimal)} {coinPairMarketInfo?.quoteAsset.name}</SwapperPriceRowInItem>
                        </SwapperPriceRowInFlex>
                        <SwapperPriceRowInFlex>
                            <SwapperPriceRowInItem>{isBuyMode ? "Average ask price" : "Average bid price"}</SwapperPriceRowInItem>
                            <SwapperPriceRowInItem>1 {coinPairMarketInfo?.baseAsset.name} = {coinPairMarketInfo?.averageUnitPrice.toFixed(quoteAsset.displayDecimal)}  {coinPairMarketInfo?.quoteAsset.name}</SwapperPriceRowInItem>
                        </SwapperPriceRowInFlex>
                        <SwapperPriceRowInFlex>
                            <SwapperPriceRowInItem>{isBuyMode ? "Highest ask price" : "Lowest bid price"}</SwapperPriceRowInItem>
                            <SwapperPriceRowInItem>1 {coinPairMarketInfo?.baseAsset.name} = {coinPairMarketInfo?.maxUnitPrice.toFixed(quoteAsset.displayDecimal)}  {coinPairMarketInfo?.quoteAsset.name}</SwapperPriceRowInItem>
                        </SwapperPriceRowInFlex>
                        <SwapperPriceRowInFlex>
                          <SwapperPriceRowInItem>Number Of Orders</SwapperPriceRowInItem>
                          <SwapperPriceRowInItem>{coinPairMarketInfo.numberOfOrders}</SwapperPriceRowInItem>
                        </SwapperPriceRowInFlex>
                        <SwapperPriceRowInFlex>
                          <SwapperPriceRowInItem>Limit {quoteAsset.name} Volumn</SwapperPriceRowInItem>
                          <SwapperPriceRowInItem>
                            {
                              coinPairMarketInfo !== undefined && coinPairMarketInfo.totalQuoteVolumn !== undefined && <SwapperPriceRowInItem>{coinPairMarketInfo?.totalQuoteVolumn.toFixed(quoteAsset.displayDecimal)} {coinPairMarketInfo?.quoteAsset?.name}</SwapperPriceRowInItem>
                            }
                          </SwapperPriceRowInItem>
                        </SwapperPriceRowInFlex>
                        <SwapperPriceRowInFlex>
                          <SwapperPriceRowInItem>Limit {baseAsset.name} Volumn</SwapperPriceRowInItem>
                          <SwapperPriceRowInItem>
                          {
                            coinPairMarketInfo !== undefined && coinPairMarketInfo.totalBaseVolumn !== undefined && <SwapperPriceRowInItem>{coinPairMarketInfo?.totalBaseVolumn.toFixed(baseAsset.displayDecimal)} {coinPairMarketInfo?.baseAsset?.name}</SwapperPriceRowInItem>
                          }
                          </SwapperPriceRowInItem>

                        </SwapperPriceRowInFlex>
                        <SwapperPriceRowInFlex>
                          <SwapperPriceRowInItem>Transaction History</SwapperPriceRowInItem>
                          <SwapperPriceRowInItem>
                            {
                              txId !== undefined ? <a target="_blank" rel="noopener noreferrer" href={`https://etherscan.io/tx/${txId}`}>View On Etherscan</a> : "N/A"
                            }
                          </SwapperPriceRowInItem>
                        </SwapperPriceRowInFlex>
                      </SwapperPriceRowGrid>
                    }

                  </SwapperPriceRow>
                  {
                    (baseAssetAllowance?.isLessThanOrEqualTo(new BigNumber(0)) || quoteAssetAllowance?.isLessThanOrEqualTo(new BigNumber(0))) ?
                    <SwapButton disabled = {true}>Please Unlock Asset</SwapButton>
                    :

                    bulkTradeBaseAmount.isEqualTo(new BigNumber(0))?
                      <SwapButton disabled = {true}>Enter Amount</SwapButton>
                    :
                    
                    isBalanceInsufficient ? 
                      <SwapButton disabled = {true}>Insufficient {isBuyMode ? quoteAsset!.name : baseAsset!.name} Balance</SwapButton>
                    :
                    
                    <SwapButton
                      onClick={()=>runTransaction(contractWrappers, chainId, account, bulkOrderList, bulkOrderSignatureList, bulkOrderListBuyAmount)}
                      disabled={isSwaping}
                    >{isSwaping ? 
                    <>
                    Swapping
                    <Loader
                      // type="Puff"
                      type="ThreeDots"
                      color="#00BFFF"
                      height={50}
                      width={50}
                      timeout={0} //0 secs = forever
                    />
                    </>  
                    : "Swap"}</SwapButton>
                  }

                  {
                      bulkOrderListBuyAmount.length == bulkOrderList.length && bulkOrderList.map((b, i)=>{
                          return(
                              <div key={i}>
                                  {
                                    isBuyMode ? 
                                    <>
                                    <span>Buying {formatAssetToGeneralDecimal(bulkOrderListBuyAmount[i].dividedBy(b.unitPrice),quoteAsset).toFixed(baseAsset.displayDecimal)} {baseAsset?.name} with {formatAssetToGeneralDecimal(bulkOrderListBuyAmount[i],quoteAsset).toFixed(quoteAsset.displayDecimal)} {quoteAsset.name} at {b.unitPrice.toFixed(quoteAsset.displayDecimal)} {quoteAsset?.name} per token (and)</span>
                                    {/* <br /> */}
                                    {/* <span>Order remain maker {bulkOrderSortedOrderBook[i].remainingFillableTakerAmountInMakerAsset.toFixed(baseAsset.displayDecimal)}{baseAsset.name} Order remain taker {bulkOrderSortedOrderBook[i].remainingFillableTakerAmount.toFixed(quoteAsset.displayDecimal)}{quoteAsset.name} </span> */}
                                    
                                    </>
                                    :
                                    <>
                                    <span>Selling {formatAssetToGeneralDecimal(bulkOrderListBuyAmount[i], baseAsset).toFixed(baseAsset.displayDecimal)} {baseAsset?.name} at {b.unitPrice.toFixed(quoteAsset.displayDecimal)} {quoteAsset?.name} per token (and)</span>
                                    {/* <span>Order remain taker {bulkOrderSortedOrderBook[i].remainingFillableTakerAmount.toFixed(baseAsset.displayDecimal)} {baseAsset.name} Order remain maker {bulkOrderSortedOrderBook[i].remainingFillableTakerAmountInMakerAsset.toFixed(quoteAsset.displayDecimal)} {quoteAsset.name} </span> */}
                                    </>
                                  }
                                  <br />
                              </div>
                              
                          )
                      })
                  }
                  <br />
                  <br />
                  
                  
                </SwapperContainer>
              </ModalContent>
              <CloseModalButton
                aria-label='Close modal'
                onClick={() => setShowModal(false)}
              />
            </ModalWrapper>
          </animated.div>
        </Background>
      )
    }else{
      return <></>
    }


}