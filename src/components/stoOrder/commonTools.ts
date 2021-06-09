import {
    BigNumber, ERC20TokenContract, MetamaskSubprovider, Web3JsProvider,
} from '0x.js';

import detectEthereumProvider from '@metamask/detect-provider';
import { CoinData, CoinSymbol, TxStatus } from './erc20Token';
import { ethers } from "ethers";
import axios from 'axios';

export const enableLog = true

export const exchange0xProxyAddress = '0xdef1c0ded9bec7f1a1670819833240f027b25eff'
export const unlockAssetGasLimit = 70000
export const swapSTOGasLimitPerTx = 600000
export const formatAssetDecimal = (amount:number | BigNumber, asset:CoinData, digit:number) =>{
    if(asset === undefined)return amount
    if(typeof amount === "number"){
        let reduced = amount * Math.pow(10, -asset.decimal)
        if(digit >= 0){
            let reducedWithRoundDigit = reduced.toFixed(digit)
            let reducedActualNumber = Number(reducedWithRoundDigit)
            return reducedActualNumber
        }else{
            return reduced
        }
    }else{
        if(amount === undefined)return new BigNumber(0)
        let reduced = amount.multipliedBy(new BigNumber( Math.pow(10, -asset.decimal)))
        if(digit >= 0){
        let reducedWithRoundDigit = reduced.toFixed(digit)
        let reducedActualNumber = Number(reducedWithRoundDigit)
        return reducedActualNumber
        }else{
            return reduced
        }
    }

}

export const formatAssetToGeneralDecimal = (amount:BigNumber, asset:CoinData) =>{
    if(asset === undefined)return amount
    if(amount === undefined)return new BigNumber(0)
    let reduced = amount.multipliedBy(new BigNumber( Math.pow(10, -asset.decimal)))
    return reduced
}

export const formatAssetToBlockchainDecimal = (amount:BigNumber, asset:CoinData) =>{
    if(asset === undefined)return amount
    if(amount === undefined)return new BigNumber(0)
    let reduced = amount.multipliedBy(new BigNumber( Math.pow(10, asset.decimal)))
    return reduced
}

export const GetAllowance = async(_account:string, coin:CoinData) =>{
    if(coin?.currentChainData === undefined ){
        return alert('can not detect quote Asset in current Chain')
    }
    try {

        const w3provider = await detectEthereumProvider() as Web3JsProvider
        const providerEngine = new MetamaskSubprovider(w3provider)
        
        const CoinCcontract = new ERC20TokenContract(coin.currentChainData.address, providerEngine, {from:_account})
        
        const allowanceBN = await CoinCcontract
            .allowance(_account,exchange0xProxyAddress)
            .callAsync()
        return allowanceBN

    } catch (error) {
        console.error(`GET ${coin.name} allowance error`, error)
        throw error
    }
}
export const SetAllowance = async(_account:string, coin:CoinData, amount:number) =>{
    try {
      
        if(coin?.currentChainData === undefined ){
            return alert('can not detect quote Asset in current Chain')
        }
      
        const w3provider = await detectEthereumProvider() as Web3JsProvider
        const providerEngine = new MetamaskSubprovider(w3provider)
        
        const CoinCcontract = new ERC20TokenContract(coin.currentChainData.address, providerEngine, {from:_account})
        enableLog && console.log("CoinCcontract", CoinCcontract)
        
        const tx = await CoinCcontract
            .approve(exchange0xProxyAddress, new BigNumber(amount))
            .sendTransactionAsync({from:_account, gas:unlockAssetGasLimit})
        enableLog && console.log("tx", tx)
        return tx
    } catch (error) {
        console.error(`set ${coin.name} allowance error`, error)
        throw error
    }
}

export const SetUSDTAllowance = async(_account:string, coin:CoinData, amount:number) =>{
    if(coin?.currentChainData === undefined ){
        return alert('can not detect quote Asset in current Chain')
    }
    try {
        let abi = ["function approve(address _spender, uint256 _value)"]
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const _contract = new ethers.Contract(coin.currentChainData.address, abi, signer)
        const res = await _contract.approve(exchange0xProxyAddress, amount, {from:_account})
        enableLog && console.log("res", res)
        // res.hash
        return res.hash
    } catch (error) {
        console.error(`set ${coin.name} allowance error`, error)
        throw error
    }
}

export const checkTxStatus = async(_txId: string) =>{
    try {
        let etherscanApiKey = process.env.REACT_APP_ETHERSCAN_APIKEY
        const res = await axios.get(`/etherscan/api?module=proxy&action=eth_getTransactionByHash&txhash=${_txId}&apikey=${etherscanApiKey}`)
        enableLog && console.log("checkTxStatus", res)
        if(res.data.result === null || res.data.result === undefined){
            return {
                txStatus:TxStatus.PendingToBlockchain,
                blockNumber:null
            }
        }
        let minedBlockNumber = res.data.result.blockNumber
        if(minedBlockNumber !== null){
            enableLog && console.log(_txId, "mined, minedBlockNumber", minedBlockNumber)
            return {
                txStatus:TxStatus.Success,
                blockNumber:Number(parseInt(minedBlockNumber,16))
            }
        }else{
            enableLog && console.log(_txId, "not mined")
            return {
                txStatus:TxStatus.PendingInBlockchain,
                blockNumber:null
            }
        }
      
    } catch (error) {
        console.error('Etherscan error', error)
        return {
            status:TxStatus.Fail,
            blockNumber:null
        }
    }
}
export const Delay = ms => new Promise(res => setTimeout(res, ms))

export interface Api0xTrackerInfo {
    address: string
    circulatingSupply: string,
    imageUrl: string,
    lastTrade: {
      date: Date,
      id: string
    },
    marketCap: number,
    name: string,
    price: {
      change: number | null,
      close: number | null,
      high: number | null,
      last: number | null,
      low: number | null,
      open: number | null
    },
    stats: {
      tradeCount: number,
      tradeVolume: {
        token: number,
        USD: number
      }
    },
    statsPeriod: 'day'|'week'|'month'|'year'|'all',
    symbol: string | CoinSymbol,
    totalSupply: number,
    type: string
}

export const Get0xTrackerInfo = async(coinData:CoinData) =>{
    try {
        // if(coinData.currentChainData === undefined){
        //     return alert(`can not get asset ${coinData.name} in current chain`)
        // } 
        const res = await axios.get(`/0xtracker/tokens/${coinData.currentChainData?.address}`)
        let info = <Api0xTrackerInfo>res.data
        return info
    } catch (error) {
        console.error('Get0xTrackerInfo error', error)
        throw error
    }
}