import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Web3 from 'web3';
import {
    MainContent,
    MainContainer,
    CardBlock,
    CardCount,
    CardCountIn,
    CardCrypto,
    CardFiat,
    CardLabel,
    CardWalletBlock,
    TableHeader,
    TableAsset,
    TableBalance,
    TableValue,
    TableContent,
    TableItem,
    TableItemAsset,
    TokenLogo,
    TokenSymbol,
    TableItemBalance,
    TableItemValue
} from './portfolioElements';
import OfferCard from '../digitalAssets/Card';
import ETH from '../../assets/icons/eth-48px.svg';
import USDT from '../../assets/icons/usdt.svg';

import { useMetaMask } from 'metamask-react';
import ERC20TokenList, { CoinData, CoinSymbol } from '../stoOrder/erc20Token';
import { Web3JsProvider, MetamaskSubprovider, BigNumber } from '0x.js';
import { ContractWrappers } from '@0x/contract-wrappers';
import detectEthereumProvider from '@metamask/detect-provider';
import { Api0xTrackerInfo, Get0xTrackerInfo } from '../stoOrder/commonTools';


const PortfolioPage = () => {
    const { account, chainId, status } = useMetaMask()
    const [ethBalance, setEthBalance] = useState<BigNumber>(new BigNumber(0))
    const [usdtBalance, setUSDTBalance] = useState<BigNumber>(new BigNumber(0))
    const [coinDataList, setCoinDataList] = useState<CoinData[]>([])
    const [coinBalanceList, setCoinBalanceList] = useState<BigNumber[]>([])
    const [coin0xTrackerInfo, setCoin0xTrackerInfo] = useState<Api0xTrackerInfo[]>([])
    const [eth0xTrackerInfo, setEth0xTrackerInfo] = useState<Api0xTrackerInfo>()
    const [usdt0xTrackerInfo, setUSDT0xTrackerInfo] = useState<Api0xTrackerInfo>()
    const [totalAssetBalance, setTotalAssetBalance] = useState<BigNumber>(new BigNumber(0))
    const [isLoadingBalance, setIsLoadingBalance] = useState(true)

    const getBalance = async(_chainId:string, _account:string ) =>{

        // get eth balance
        const web3 = new Web3(window.ethereum)
        var bal = await web3.eth.getBalance(_account);
        const _ethBalance = new BigNumber(bal).multipliedBy(new BigNumber(Math.pow(10,-18)))
        setEthBalance(_ethBalance)

        const processedChainID = parseInt(_chainId,16)
        
        const _coinDataList:CoinData[] = []
        const coinAssetDataList:string[] = []
        const _coinBalanceList:BigNumber[] = []
        const _coin0xTrackerInfo:Api0xTrackerInfo[] = []
        let _eth0xTrackerInfo:Api0xTrackerInfo

        // get USDT & STO info
        const WETH = ERC20TokenList.find(e=>e.coinSymbol === CoinSymbol.WETH)
        const USDT = ERC20TokenList.find(e=>e.coinSymbol === CoinSymbol.USDT)
        const FST = ERC20TokenList.find(e=>e.coinSymbol === CoinSymbol.FST)
        // const BKR = ERC20TokenList.find(e=>e.coinSymbol === CoinSymbol.BKR)

        _coinDataList.push(WETH as CoinData)
        _coinDataList.push(USDT as CoinData)
        _coinDataList.push(FST as CoinData)
        // _coinDataList.push(BKR as CoinData)

        _coinDataList.map(c=>{
            c.currentChainData = c.chains.find(e=>e.chainId === processedChainID )
            if(c === undefined){
                return alert("Failed to load asset")
            }
            if(c.currentChainData === undefined){
                return alert(`Chain error, can not found the ${c.name} on chain ${processedChainID}`)
            }
            coinAssetDataList.push(c.currentChainData.assetData)
        })
        setCoinDataList(_coinDataList)
        
        
        // get USDT & STO balance
        const w3provider = await detectEthereumProvider() as Web3JsProvider
        const providerEngine = new MetamaskSubprovider(w3provider)
        const contractWrappers = new ContractWrappers(providerEngine,{chainId:processedChainID})
        
        const batchBalance = await contractWrappers.devUtils.getBatchBalances(_account, coinAssetDataList).callAsync()
        console.log("batchBalance", batchBalance)
        batchBalance.map((b,i)=>{
            let _b = new BigNumber(b).multipliedBy(new BigNumber(Math.pow(10,-_coinDataList[i].decimal)))
            _coinBalanceList.push(_b)
            if(_coinDataList[i].coinSymbol === CoinSymbol.USDT){
                setUSDTBalance(_b)
            }
        })
        setCoinBalanceList(_coinBalanceList)
        
        
        try {
            // get price of WETH, USDT, STO

            _eth0xTrackerInfo = await Get0xTrackerInfo(WETH as CoinData)
            setEth0xTrackerInfo(_eth0xTrackerInfo)

            let tokenListLength = _coinDataList.length
            for(let i = 0; i < tokenListLength; i++){
                const _0xTrackerInfo = await Get0xTrackerInfo(_coinDataList[i])
                _0xTrackerInfo.symbol = _coinDataList[i].coinSymbol
                _coin0xTrackerInfo.push(_0xTrackerInfo)
                if(_coinDataList[i].coinSymbol === CoinSymbol.USDT){
                    setUSDT0xTrackerInfo(_0xTrackerInfo)
                }
            } 
            setCoin0xTrackerInfo(_coin0xTrackerInfo)
            // console.log("_coin0xTrackerInfo", _coin0xTrackerInfo)

                    // cal total asset balance
            let _totalAssetBalance = new BigNumber(0)
            _coin0xTrackerInfo.map((ct, i)=>{
                let lastPrice = ct.price.last as number
                if(lastPrice === null){
                    lastPrice = 0
                }
                _totalAssetBalance = _totalAssetBalance.plus(_coinBalanceList[i].multipliedBy(new BigNumber(lastPrice)))
            })
            // add eth price to total balance
            _totalAssetBalance = _totalAssetBalance.plus(_ethBalance.multipliedBy(new BigNumber(_eth0xTrackerInfo.price.last as number)))

            setTotalAssetBalance(_totalAssetBalance)
            // console.log("_totalAssetBalance", _totalAssetBalance.toString())

        } catch (error) {
            console.error("_coin0xTrackerInfo error", error)
        }
        
      }
    useEffect(()=>{
        if(chainId !== null && account !== null){
            getBalance(chainId, account)
        }
    },[account, chainId])
    useEffect(()=>{
        if(coinBalanceList.length > 0 && coinBalanceList.length === coinDataList.length){
            setIsLoadingBalance(false)
        }
    },[coinBalanceList, coinDataList])
    if(account === null){
        return(
            <React.Fragment>
            <MainContent>
                <MainContainer>
                    <Typography style={{textAlign: 'center'}} variant="h4">
                        Please connect metamask
                    </Typography>
                </MainContainer>
                </MainContent>
            </React.Fragment>
        )
    }
    if(isLoadingBalance){
        return(
            <React.Fragment>
            <MainContent>
                <MainContainer>
                    <Typography style={{textAlign: 'center'}} variant="h4">
                        Loading Balance
                    </Typography>
                </MainContainer>
                </MainContent>
            </React.Fragment>
        )
    }else{
        return(
            <React.Fragment>
                <MainContent>
                    <MainContainer>
                        <Typography style={{textAlign: 'center'}} variant="h4">
                            Portfolio
                        </Typography>
                        <br></br>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6} lg={4}>
                            <CardBlock>
                                <CardLabel>ETH Balance</CardLabel>
                                {
                                    eth0xTrackerInfo !== undefined && <CardFiat>${ethBalance.multipliedBy(new BigNumber(eth0xTrackerInfo.price.last as number)).toFixed(2)}</CardFiat>
                                }
                                <CardCrypto>{ethBalance.toFixed(8)}</CardCrypto>
                                <CardCount>
                                    <CardCountIn><img src={ETH} style={{maxWidth: '30px'}} /></CardCountIn>
                                </CardCount>
                            </CardBlock>                        
                            </Grid>
                            <Grid item xs={12} md={6} lg={4}>
                            <CardBlock>
                                <CardLabel>USDT Balance</CardLabel>
                                {/* <CardFiat>$516.88</CardFiat> */}
                                {
                                    usdt0xTrackerInfo !== undefined && <CardFiat>${usdtBalance.multipliedBy(new BigNumber(usdt0xTrackerInfo.price.last as number)).toFixed(2)}</CardFiat>
                                }
                                <CardCrypto>{usdtBalance.toFixed(6)}</CardCrypto>
                                <CardCount>
                                    <CardCountIn><img src={USDT} style={{width: '30px'}} /></CardCountIn>
                                </CardCount>
                            </CardBlock>   
                            </Grid>
                            <Grid item xs={12} md={6} lg={4}>
                            <CardBlock>
                                <CardLabel>Total Balance</CardLabel>
                                <CardFiat>${totalAssetBalance.toFixed(2)}</CardFiat>
                                <CardCrypto></CardCrypto>
                                <CardCount>
                                    <CardCountIn>{coinDataList.length} Assets</CardCountIn>
                                </CardCount>
                            </CardBlock>                           
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                            <CardWalletBlock>
                                <h2 style={{margin:0}}>Balance</h2>
                                <TableHeader>
                                    <TableAsset>Asset</TableAsset>
                                    {/* <TableBalance>Market Volumn</TableBalance> */}
                                    <TableBalance>Price (USD)</TableBalance>
                                    <TableBalance>Balance</TableBalance>
                                    <TableValue>Value</TableValue>
                                </TableHeader>
                                <TableContent>
                                    <TableItem>
                                        <TableItemAsset>
                                            <TokenLogo><img src={ETH} style={{width: '28px'}}/></TokenLogo>
                                            <TokenSymbol>{"ETH"}</TokenSymbol>
                                        </TableItemAsset>
                                        {/* <TableItemBalance>{coin0xTrackerInfo[i].marketCap}</TableItemBalance> */}
                                        <TableItemBalance>{eth0xTrackerInfo?.price.last}</TableItemBalance>
                                        <TableItemBalance>{ethBalance.toFixed(8)}</TableItemBalance>
                                        {
                                            eth0xTrackerInfo !== undefined && eth0xTrackerInfo?.price.last !== null && 
                                            <TableItemValue>${ethBalance.multipliedBy(new BigNumber(eth0xTrackerInfo.price.last as number)).toFixed(2)}</TableItemValue>
                                        }
                                    </TableItem>
                                    {
                                        coinDataList.length === coinBalanceList.length && coinDataList.length === coin0xTrackerInfo.length && coinDataList.map((c,i)=>{
                                            if(c.coinSymbol === CoinSymbol.WETH)return
                                            return(
                                                <TableItem key={c.coinSymbol}>
                                                    <TableItemAsset>
                                                        <TokenLogo><img src={c.icon} style={{width: '28px'}}/></TokenLogo>
                                                        <TokenSymbol>{c.name}</TokenSymbol>
                                                    </TableItemAsset>
                                                    {/* <TableItemBalance>{coin0xTrackerInfo[i].marketCap}</TableItemBalance> */}
                                                    <TableItemBalance>{((price = coin0xTrackerInfo[i].price.last) => price ? price.toFixed(2) : '0')()}</TableItemBalance>
                                                    <TableItemBalance>{coinBalanceList[i].toFixed(c.displayDecimal)}</TableItemBalance>
                                                    {
                                                        coin0xTrackerInfo[i].price.last !== null && 
                                                        <TableItemValue>${coinBalanceList[i].multipliedBy(new BigNumber(coin0xTrackerInfo[i].price.last as number)).toFixed(2)}</TableItemValue>
                                                    }
                                                </TableItem>
                                            )
                                        })
                                    }
                                </TableContent>
                            </CardWalletBlock>                           
                            </Grid>
                        </Grid>
                    </MainContainer>
                </MainContent>
            </React.Fragment>
        )
    }
    return (
        <React.Fragment>
            <MainContent>
                <MainContainer>
                    <Typography style={{textAlign: 'center'}} variant="h4">
                        Portfolio
                    </Typography>
                    <br></br>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={4}>
                            <CardBlock>
                                <CardLabel>ETH Balance</CardLabel>
                                <CardFiat>$2156.88</CardFiat>
                                <CardCrypto>{ethBalance.toFixed(8)}</CardCrypto>
                                <CardCount>
                                    <CardCountIn><img src={ETH} style={{maxWidth: '30px'}} /></CardCountIn>
                                </CardCount>
                            </CardBlock>                        
                        </Grid>
                        {
                            coinDataList.length === coinBalanceList.length && coinDataList.map((c,i)=>{
                                return(
                                    <Grid item xs={12} md={6} lg={4} key={c.coinSymbol}>
                                        <CardBlock>
                                            <CardLabel>{c.name} Balance</CardLabel>
                                            <CardFiat>$516.88</CardFiat>
                                            <CardCrypto>{coinBalanceList[i].toFixed(c.displayDecimal)}</CardCrypto>
                                            <CardCount>
                                                <CardCountIn><img src={c.icon} style={{width: '30px'}} /></CardCountIn>
                                            </CardCount>
                                        </CardBlock>  
                                    </Grid> 
                                )
                            })
                        }
                        <br />
                        <br />
                        <br />
                        <br />
                        {/* <Grid item xs={12} md={6} lg={4}>
                        <CardBlock>
                            <CardLabel>USDC Balance</CardLabel>
                            <CardFiat>$516.88</CardFiat>
                            <CardCrypto>516.77</CardCrypto>
                            <CardCount>
                                <CardCountIn><img src={USDC} style={{width: '30px'}} /></CardCountIn>
                            </CardCount>
                        </CardBlock>   
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                        <CardBlock>
                            <CardLabel>Total Balance</CardLabel>
                            <CardFiat>$2156.88</CardFiat>
                            <CardCrypto>0.576892</CardCrypto>
                            <CardCount>
                                <CardCountIn>5 Assets</CardCountIn>
                            </CardCount>
                        </CardBlock>                           </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                        <CardWalletBlock>
                            <h2 style={{margin:0}}>Balance</h2>
                            <CardFiat>$2156.88</CardFiat>
                            <CardCrypto>0.576892</CardCrypto>
                            <CardCount>
                                <CardCountIn>5 Assets</CardCountIn>
                            </CardCount>
                        </CardWalletBlock>                           
                        </Grid> */}
                    </Grid>
                </MainContainer>
            </MainContent>
        </React.Fragment>
    )
}


export default PortfolioPage;