import React, { useRef, useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
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

// import { LimitOrder } from '@0x/protocol-utils'
import { ContractWrappers, ERC20TokenContract, } from '@0x/contract-wrappers';
import detectEthereumProvider from '@metamask/detect-provider';
import { useMetaMask } from 'metamask-react';
import axios from 'axios'
import CSS from 'csstype';
import {
  BigNumber,
  MetamaskSubprovider,
  Web3JsProvider,
  generatePseudoRandomSalt
  
} from '0x.js';
import ERC20TokenList, { CoinData, CoinPair, CoinSymbol, Get0xBaseUrl, OrderBookSingleOrder, OrderDetailData, OrderSignature, TxStatus } from '../erc20Token';
import { formatAssetToGeneralDecimal, formatAssetDecimal, SetAllowance, GetAllowance, enableLog, SetUSDTAllowance, checkTxStatus, Delay } from '../commonTools';
import Loader from 'react-loader-spinner';
BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_UP, DECIMAL_PLACES:8 })


// jacky buy widget interface =======================

const utils = require('@0x/protocol-utils');

// jacky buy widget interface end =======================
export const LimitBuySellModal = ({
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
  const [coinPairLimitInfo, setCoinPairLimitInfo] = useState<CoinPair>()

  const [sortedOrderBook, setSortedOrderBook] = useState<OrderDetailData[]>([])
  const [limitTradeBaseAmount, setLimitBuyBaseAmount] = useState<BigNumber>(new BigNumber(0))
  const [quoteUnitPrice, setQuoteUnitPrice] = useState<BigNumber>(new BigNumber(0))
  const [quoteTotalPrice, setQuoteTotalPrice] = useState<BigNumber>(new BigNumber(0))
  const [isLimitBuyMode, setIsBuyMode] = useState(true)

  const [isUnlockingBaseAsset, setIsUnlockingBaseAsset] = useState(false)
  const [isUnlockingQuoteAsset, setIsUnlockingQuoteAsset] = useState(false)
  
  const toggleLimitBuySellMode = async(_isLimitBuyMode:boolean, _chainId:string, _stoToken:CoinData, _StableCoin:CoinData) =>{

    setSortedOrderBook([])

    let newIsBuyMode = !_isLimitBuyMode
    setIsBuyMode(newIsBuyMode)

    const newSortedOrderBook = await getSortedOrderBook(newIsBuyMode, _chainId, _StableCoin, _stoToken)
    setSortedOrderBook(newSortedOrderBook)
    analyseLimitInfo(newIsBuyMode, newSortedOrderBook, _StableCoin, _stoToken)

  }

  const handleChangeLimitAmount = (totalBaseAmount:BigNumber, _baseAsset:CoinData, _quoteAsset:CoinData, unitPrice:BigNumber) =>{
    setLimitBuyBaseAmount(totalBaseAmount.decimalPlaces(_baseAsset.decimal))
    let totalPrice = totalBaseAmount.multipliedBy(unitPrice).decimalPlaces(_quoteAsset.decimal)
    setQuoteTotalPrice(totalPrice)
  }
  const handleChangeQuoteUnitPrice = (totalBaseAmount:BigNumber, _quoteAsset:CoinData, unitPrice:BigNumber) =>{
    let _unitPrice = unitPrice.decimalPlaces(_quoteAsset.decimal)
    let totalPrice = totalBaseAmount.multipliedBy(unitPrice).decimalPlaces(_quoteAsset.decimal)
    setQuoteUnitPrice(_unitPrice)
    setQuoteTotalPrice(totalPrice)
  }

  const handleChangeQuoteTotalPrice = (totalBaseAmount:BigNumber, _quoteAsset:CoinData, totalPrice:BigNumber) =>{
    let unitPrice = totalPrice.dividedBy(totalBaseAmount).decimalPlaces(_quoteAsset.decimal)
    let _totalPrice = totalPrice.decimalPlaces(_quoteAsset.decimal)
    setQuoteUnitPrice(unitPrice)
    setQuoteTotalPrice(_totalPrice)
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
    const sortedOrderBook = await getSortedOrderBook(isLimitBuyMode, _chainId,_quoteAsset, _baseAsset)
    analyseLimitInfo(isLimitBuyMode, sortedOrderBook, _quoteAsset, _baseAsset)
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
      enableLog && console.error("getUserBalance error", error)
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
  const getSortedOrderBook = async(_isLimitBuyMode:boolean, _chainId:string, _quoteAsset:CoinData, _baseAsset:CoinData) =>{

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

    if(_isLimitBuyMode){
      enableLog && console.log("_isLimitBuyMode orderBookRes")
      tempOrderBook = orderBookRes.data.asks.records as OrderBookSingleOrder[]
      tempOrderBook.map(e=>{
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
    setSortedOrderBook(sortedOrderBook)
    return sortedOrderBook

  }
  
  const analyseLimitInfo = async (_isLimitBuyMode:boolean, sortedOrderBook:OrderDetailData[], _quoteAsset:CoinData, _baseAsset:CoinData) =>{
    if(sortedOrderBook === undefined){
        return alert('sortedOrderBook not found')
    }
    // find min, max, average, total volumn
    // cal vol
    let tempQuoteVolumn = new BigNumber(0)
    let tempBaseVolumn = new BigNumber(0)
    let averageUnitPrice = new BigNumber(0)

    sortedOrderBook.map(s=>{
      if(_isLimitBuyMode){
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
    setCoinPairLimitInfo(coinPairData)
  }

  const LimitOrderCoinToMesh = async(_chainId:string,_contractWrappers:ContractWrappers,_web3Provider:Web3JsProvider,walletAccount:string, makerToken:CoinData, makeAmount:BigNumber, takerToken:CoinData , takeAmount:BigNumber) =>{
    try {
      if(makerToken?.currentChainData === undefined || takerToken?.currentChainData === undefined){
          return alert('can not detect Asset in current Chain')
      }
      const processedChainID = parseInt(_chainId,16)
      const providerEngine = new MetamaskSubprovider(_web3Provider)

      const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"
      // const salt = "88410672309418223763063734186784192419437623032853622266677289218392648131474"

      const salt = await generatePseudoRandomSalt()
      let orderData = {
        // https://protocol.0x.org/en/latest/basics/orders.html
          takerTokenFeeAmount: new BigNumber(0),
          sender:NULL_ADDRESS,
          feeRecipient: NULL_ADDRESS,
          makerToken: makerToken.currentChainData.address,
          takerToken: takerToken.currentChainData.address,
          makerAmount: new BigNumber(makeAmount),
          takerAmount: new BigNumber(takeAmount),
          maker: walletAccount,
          taker: NULL_ADDRESS,
          pool:NULL_ADDRESS,
          expiry: (new BigNumber(Date.now() + 185 * 86400000)).dividedBy(new BigNumber(1000)),    // Unix timestamp in seconds  
          verifyingContract: '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
          salt: salt,
          chainId: processedChainID, 
      }
      const order = new utils.LimitOrder(orderData)


      const signature = await order.getSignatureWithProviderAsync(
          providerEngine,
          utils.SignatureType.EIP712
      );
      enableLog && console.log("order", order)
      enableLog && console.log("signature", signature)

      const res = await axios.post(`${Get0xBaseUrl(processedChainID)}/sra/v4/order`,{
          ...orderData,
          signature
      })
      
      window.alert("Your limit order has been placed.")

      // update market data
      if(quoteAsset !== undefined && baseAsset !== undefined){
        const sortedOrderBook = await getSortedOrderBook(isLimitBuyMode,_chainId, quoteAsset, baseAsset)
        analyseLimitInfo(isLimitBuyMode, sortedOrderBook, quoteAsset, baseAsset)
      }

    } catch (error) {
        enableLog && console.error("0xError", error)
        alert("Failed to place the limit order.")
    }

  }
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
    }else if(contractWrappers === undefined || chainId === null || account === null || quoteAsset === undefined || baseAsset === undefined || sto === undefined || stableCoin === undefined){
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
                  isLimitBuyMode ?
                  <h1>Limit Buy {baseAsset?.name} Tokens with {quoteAsset?.name}</h1>
                  :
                  <h1>Limit Sell {baseAsset?.name} Tokens for {quoteAsset?.name}</h1>
                }
                <button onClick={async()=>{toggleLimitBuySellMode(isLimitBuyMode, chainId, sto, stableCoin)}}>{isLimitBuyMode ? "Limit Sell" : "Limit Buy"}</button>
                <SwapperContainer>

                  <SwapperField>
                    <SwapperFieldTopRow>
                        <SwapperFieldTopRowIn>
                          <SwapperFieldTopRowInItem>{isLimitBuyMode ? "You Limit Buy" : "You Limit Sell"}</SwapperFieldTopRowInItem>
                          {
                            baseAssetBalance !== undefined && baseAssetAllowance !== undefined &&  <SwapperFieldTopRowInItem>Balance: {formatAssetDecimal(baseAssetBalance?.toNumber(), baseAsset, 8)} | Allowance: {formatAssetDecimal(baseAssetAllowance?.toNumber(), baseAsset, 8)}</SwapperFieldTopRowInItem>
                          }
                        </SwapperFieldTopRowIn>
                    </SwapperFieldTopRow>
                    <SwapperFieldBottomRow>
                        <SwapperBottomRowLeft type="number" value={limitTradeBaseAmount.toNumber()} id="limitTradeBaseAmount" step="0.00000001" onChange={e=>handleChangeLimitAmount(new BigNumber(e.currentTarget.value || 0), baseAsset, quoteAsset,  quoteUnitPrice)}  
                          // onBlur={()=>BulkBuyCoinFromMesh(contractWrappers, account, (limitTradeBaseAmount.multipliedBy(new BigNumber(Math.pow(10,baseAsset?.decimal)))), new BigNumber(0), true)}
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

                  <SwapperField>
                    <SwapperFieldTopRow>
                      <SwapperFieldTopRowIn>
                        <SwapperFieldTopRowInItem>At unit price</SwapperFieldTopRowInItem>
                      </SwapperFieldTopRowIn>
                    </SwapperFieldTopRow>
                    <SwapperFieldBottomRow>
                        <SwapperBottomRowLeft type="number" value={quoteUnitPrice.toNumber()} id="quoteUnitPrice" step="0.00000001" onChange={e=>handleChangeQuoteUnitPrice(limitTradeBaseAmount, quoteAsset,new BigNumber((e.currentTarget.value || 0)))}  
                          // onBlur={()=>BulkBuyCoinFromMesh(contractWrappers, account, (limitTradeBaseAmount.multipliedBy(new BigNumber(Math.pow(10,baseAsset?.decimal)))), new BigNumber(0), true)}
                        />
                        <SwapperBottomRowRight>
                            <SwapperBottomRowRightSpan>
                                <SwapperBottomRowRightSpanImg src={quoteAsset.icon}/>
                                <SwapperBottomRowRightSpanSymbol>{quoteAsset?.name}</SwapperBottomRowRightSpanSymbol>
                            </SwapperBottomRowRightSpan>
                        </SwapperBottomRowRight>
                    </SwapperFieldBottomRow>
                  </SwapperField>   

                  <SwapperField>
                    <SwapperFieldTopRow>
                        <SwapperFieldTopRowIn>
                          <SwapperFieldTopRowInItem>{isLimitBuyMode ? "You will Pay" : "You will Get"}</SwapperFieldTopRowInItem>
                          {
                            quoteAssetBalance !== undefined && quoteAssetAllowance !== undefined &&  <SwapperFieldTopRowInItem>Balance: {formatAssetDecimal(quoteAssetBalance?.toNumber(), quoteAsset, 8)} {/**| Allowance: {formatAssetDecimal(quoteAssetAllowance?.toNumber(), quoteAsset, 8)} */}</SwapperFieldTopRowInItem>
                          }
                        </SwapperFieldTopRowIn>
                    </SwapperFieldTopRow>
                    <SwapperFieldBottomRow>
                        <SwapperBottomRowLeft type="number" value={quoteTotalPrice.toNumber()} id="quoteTotalPrice" step="0.00000001" onChange={e=>handleChangeQuoteTotalPrice(limitTradeBaseAmount, quoteAsset, new BigNumber(e.currentTarget.value || 0))}  
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
                        {/* <SwapperBottomRowMiddle
                          onClick={()=>SetAllowance(account, quoteAsset, Math.pow(2,255))}
                        >Unlock</SwapperBottomRowMiddle> */}
                        <SwapperBottomRowRight>
                            <SwapperBottomRowRightSpan>
                                <SwapperBottomRowRightSpanImg src={quoteAsset.icon}/>
                                <SwapperBottomRowRightSpanSymbol>{quoteAsset?.name}</SwapperBottomRowRightSpanSymbol>
                            </SwapperBottomRowRightSpan>
                        </SwapperBottomRowRight>
                    </SwapperFieldBottomRow>
                  </SwapperField>  


                  <SwapperPriceRow>
                    {
                      coinPairLimitInfo && 
                      <SwapperPriceRowGrid>
                        <SwapperPriceRowInFlex>
                            <SwapperPriceRowInItem>{isLimitBuyMode ? "Best ask price" : "Best bid price"}</SwapperPriceRowInItem>
                            <SwapperPriceRowInItem>1 {coinPairLimitInfo?.baseAsset.name} = {coinPairLimitInfo?.minUnitPrice.toFixed(quoteAsset.displayDecimal)} {coinPairLimitInfo?.quoteAsset.name}</SwapperPriceRowInItem>
                        </SwapperPriceRowInFlex>
                        <SwapperPriceRowInFlex>
                            <SwapperPriceRowInItem>{isLimitBuyMode ? "Average ask price" : "Average bid price"}</SwapperPriceRowInItem>
                            <SwapperPriceRowInItem>1 {coinPairLimitInfo?.baseAsset.name} = {coinPairLimitInfo?.averageUnitPrice.toFixed(quoteAsset.displayDecimal)}  {coinPairLimitInfo?.quoteAsset.name}</SwapperPriceRowInItem>
                        </SwapperPriceRowInFlex>
                        <SwapperPriceRowInFlex>
                            <SwapperPriceRowInItem>{isLimitBuyMode ? "Highest ask price" : "Lowest bid price"}</SwapperPriceRowInItem>
                            <SwapperPriceRowInItem>1 {coinPairLimitInfo?.baseAsset.name} = {coinPairLimitInfo?.maxUnitPrice.toFixed(quoteAsset.displayDecimal)}  {coinPairLimitInfo?.quoteAsset.name}</SwapperPriceRowInItem>
                        </SwapperPriceRowInFlex>
                        <SwapperPriceRowInFlex>
                          <SwapperPriceRowInItem>Number Of Orders</SwapperPriceRowInItem>
                          <SwapperPriceRowInItem>{coinPairLimitInfo.numberOfOrders}</SwapperPriceRowInItem>
                        </SwapperPriceRowInFlex>
                        <SwapperPriceRowInFlex>
                          <SwapperPriceRowInItem>Limit {quoteAsset.name} Volumn</SwapperPriceRowInItem>
                          <SwapperPriceRowInItem>
                            {
                              coinPairLimitInfo !== undefined && coinPairLimitInfo.totalQuoteVolumn !== undefined && <SwapperPriceRowInItem>{coinPairLimitInfo?.totalQuoteVolumn.toFixed(quoteAsset.displayDecimal)} {coinPairLimitInfo?.quoteAsset?.name}</SwapperPriceRowInItem>
                            }
                          </SwapperPriceRowInItem>
                        </SwapperPriceRowInFlex>
                        <SwapperPriceRowInFlex>
                          <SwapperPriceRowInItem>Limit {baseAsset.name} Volumn</SwapperPriceRowInItem>
                          <SwapperPriceRowInItem>
                          {
                            coinPairLimitInfo !== undefined && coinPairLimitInfo.totalBaseVolumn !== undefined && <SwapperPriceRowInItem>{coinPairLimitInfo?.totalBaseVolumn.toFixed(baseAsset.displayDecimal)} {coinPairLimitInfo?.baseAsset?.name}</SwapperPriceRowInItem>
                          }
                          </SwapperPriceRowInItem>
                        </SwapperPriceRowInFlex>
                      </SwapperPriceRowGrid>
                    }

                  </SwapperPriceRow>
                  {
                    limitTradeBaseAmount.isEqualTo(new BigNumber(0)) || quoteUnitPrice.isEqualTo(new BigNumber(0))?
                      <SwapButton disabled = {true}>Enter Amount</SwapButton>
                    :
                    isLimitBuyMode && quoteAssetBalance && quoteTotalPrice.isGreaterThan(formatAssetDecimal(quoteAssetBalance?.toNumber(), quoteAsset, 8)) ? 
                      <SwapButton disabled = {true}>Insufficient {quoteAsset?.name} Balance</SwapButton>
                    :
                    !isLimitBuyMode && baseAssetBalance && limitTradeBaseAmount.isGreaterThan(formatAssetDecimal(baseAssetBalance?.toNumber(), baseAsset, 8)) ? 
                      <SwapButton disabled = {true}>Insufficient {baseAsset?.name} Balance</SwapButton>
                    :
                    isLimitBuyMode ? 
                    <SwapButton
                      onClick={()=>{
                        let quoteTotalPriceWithDecimal = quoteTotalPrice.multipliedBy(new BigNumber(Math.pow(10, quoteAsset.decimal)))
                        let limitTradeBaseAmountWithDecimal = limitTradeBaseAmount.multipliedBy(new BigNumber(Math.pow(10, baseAsset.decimal)))
                        chainId !== null && web3Provider !== undefined && LimitOrderCoinToMesh(chainId, contractWrappers,web3Provider ,account, quoteAsset, quoteTotalPriceWithDecimal, baseAsset, limitTradeBaseAmountWithDecimal)
                      }}
                    >Limit Buy</SwapButton>
                    :
                    <SwapButton
                      onClick={()=>{
                        let quoteTotalPriceWithDecimal = quoteTotalPrice.multipliedBy(new BigNumber(Math.pow(10, quoteAsset.decimal)))
                        let limitTradeBaseAmountWithDecimal = limitTradeBaseAmount.multipliedBy(new BigNumber(Math.pow(10, baseAsset.decimal)))
                        chainId !== null && web3Provider !== undefined && LimitOrderCoinToMesh(chainId, contractWrappers,web3Provider ,account, baseAsset, limitTradeBaseAmountWithDecimal, quoteAsset, quoteTotalPriceWithDecimal)
                      }}
                    >Limit Sell</SwapButton>
                  }

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