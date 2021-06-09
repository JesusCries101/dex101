import {
    assetDataUtils,
    BigNumber,
    
} from '0x.js';
import USDT from '../../assets/icons/usdt.svg';
import FST from '../../assets/icons/FS.png';
import DAI from '../../assets/icons/dai.svg'
import BKR from '../../assets/icons/bkr.svg'
import FUN from '../../assets/icons/fun.svg'

export const apiMainnetBaseUrl = "https://api.0x.org"
export const apiKovanBaseUrl = "http://localhost:3000"
export const Get0xBaseUrl = (chainId:number) =>{
    console.log("Get0xBaseUrl chainId", chainId)
    switch(chainId){
        case 1:
            return apiMainnetBaseUrl
        case 42: 
            return apiKovanBaseUrl
        default:
            return alert(`No 0x BaseUrl for chain ${chainId}`)
    }
}

export interface ChainData {
    chainId:number,
    address:string
    assetData:string
}

export interface CoinData {
    name:string
    coinSymbol:CoinSymbol
    icon:string
    chains:ChainData[]
    currentChainData:ChainData | undefined
    decimal: number
    displayDecimal: number
}
export interface CoinPair {
    quoteAsset:CoinData
    baseAsset:CoinData
    minUnitPrice:BigNumber
    maxUnitPrice:BigNumber
    averageUnitPrice:BigNumber
    numberOfOrders:number
    totalBaseVolumn:BigNumber
    totalQuoteVolumn:BigNumber
}

export interface OrderSignature {
    signatureType: number
    r: string
    s:string
    v: number
  }
export interface OrderDetailData{
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
    remainingFillableTakerAmountInMakerAsset:BigNumber
    unitPrice : BigNumber
}
export interface OrderMetaData {
    orderHash:string
    createdAt:Date
    remainingFillableTakerAmount:number
}
export interface OrderBookSingleOrder {
    order:OrderDetailData
    metaData:OrderMetaData
}
export enum TxStatus{
    PendingToBlockchain="PendingToBlockchain",
    PendingInBlockchain="PendingInBlockchain",
    Success="Success",
    Fail="Fail",
}
export enum CoinSymbol{
    FAU="FAU",
    DAI="DAI",
    BKR="BKR",
    FST="FST",
    USDT="USDT",
    USDC="USDC",
    UNI="UNI",
    WETH="WETH",
}
const ERC20TokenList:CoinData[] = [
    {
    name:"FAU",
    coinSymbol:CoinSymbol.FAU,
    icon:USDT,
    chains:[
        {
            chainId:42,
            address:"0xFab46E002BbF0b4509813474841E0716E6730136",
            assetData:assetDataUtils.encodeERC20AssetData("0xFab46E002BbF0b4509813474841E0716E6730136"),
        },
        {
            chainId:1,
            address:"0xfab46e002bbf0b4509813474841e0716e6730136",
            assetData:assetDataUtils.encodeERC20AssetData("0xfab46e002bbf0b4509813474841e0716e6730136"),
        }
    ],
        currentChainData:undefined,
        decimal:18,
        displayDecimal:8
    },
    {
        name:"DAI",
        coinSymbol:CoinSymbol.DAI,
        icon:DAI,
        chains:[
            {
                chainId:42,
                address:"0xff795577d9ac8bd7d90ee22b6c1703490b6512fd",
                assetData:assetDataUtils.encodeERC20AssetData("0xff795577d9ac8bd7d90ee22b6c1703490b6512fd"),
            }
        ],
        currentChainData:undefined,
        decimal:18,
        displayDecimal:8
    },
    {
        name:"BKR",
        coinSymbol:CoinSymbol.BKR,
        icon:BKR,
        chains:[
            {
                chainId:1,
                address:"0xc4777287ddceb283ed6db59c88db5074f1b25e4e",
                assetData:assetDataUtils.encodeERC20AssetData("0xc4777287ddceb283ed6db59c88db5074f1b25e4e"),
            }
        ],
        currentChainData:undefined,
        decimal:18,
        displayDecimal:8
    },
    {
        name:"FST",
        coinSymbol:CoinSymbol.FST,
        icon:FST,
        chains:[
            {
                chainId:1,
                address:"0x6d1c15725e3979f654bd929e1ccad48708bd4284",
                assetData:assetDataUtils.encodeERC20AssetData("0x6d1c15725e3979f654bd929e1ccad48708bd4284"),
            }
        ],        
        currentChainData:undefined,
        decimal:0,
        displayDecimal:0
    },
    {
        name:"USDT",
        coinSymbol:CoinSymbol.USDT,
        icon:USDT,
        chains:[
            {
                chainId:1,
                address:"0xdac17f958d2ee523a2206206994597c13d831ec7",
                assetData:assetDataUtils.encodeERC20AssetData("0xdac17f958d2ee523a2206206994597c13d831ec7"),
            }
        ],        
        currentChainData:undefined,
        decimal:6,
        displayDecimal:6
    },
    {
        name:"USDC",
        coinSymbol:CoinSymbol.USDC,
        icon:USDT,
        chains:[
            {
                chainId:1,
                address:"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                assetData:assetDataUtils.encodeERC20AssetData("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"),
            }
        ],        
        currentChainData:undefined,
        decimal:6,
        displayDecimal:6
    },
    {
        name:"UNI",
        coinSymbol:CoinSymbol.UNI,
        icon:USDT,
        chains:[
            {
                chainId:42,
                address:"0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
                assetData:assetDataUtils.encodeERC20AssetData("0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"),
            }
        ],        
        currentChainData:undefined,
        decimal:18,
        displayDecimal:8
    },
    {
        name:"WETH",
        coinSymbol:CoinSymbol.WETH,
        icon:USDT,
        chains:[
            {
                chainId:42,
                address:"0xd0a1e359811322d97991e03f863a0c30c2cf029c",
                assetData:assetDataUtils.encodeERC20AssetData("0xd0a1e359811322d97991e03f863a0c30c2cf029c"),
            },
            {
                chainId:1,
                address:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                assetData:assetDataUtils.encodeERC20AssetData("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"),
            }
        ],        
        currentChainData:undefined,
        decimal:18,
        displayDecimal:8
    }

    // 
    // 
]

export default ERC20TokenList