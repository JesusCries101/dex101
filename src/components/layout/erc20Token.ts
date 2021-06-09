import {
    assetDataUtils,
    BigNumber,
    
} from '0x.js';

export interface ChainData {
    chainId:number,
    address:string
    assetData:string
}

export interface CoinData {
    name:string
    chains:ChainData[]
    currentChainData:ChainData | undefined
    decimal: number
}
export interface CoinPair {
    quoteAsset:CoinData
    baseAsset:CoinData
    minUnitPrice:BigNumber
    maxUnitPrice:BigNumber
    averageUnitPrice:BigNumber
    totalVolumn:BigNumber
}

const ERC20TokenList:CoinData[] = [
    {
    name:"FAU",
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
        decimal:18
    },
    {
        name:"DAI",
        chains:[
            {
                chainId:42,
                address:"0xff795577d9ac8bd7d90ee22b6c1703490b6512fd",
                assetData:assetDataUtils.encodeERC20AssetData("0xff795577d9ac8bd7d90ee22b6c1703490b6512fd"),
            }
        ],
        currentChainData:undefined,
        decimal:18
    },
    {
        name:"BKR(STO)",
        chains:[
            {
                chainId:1,
                address:"0xc4777287ddceb283ed6db59c88db5074f1b25e4e",
                assetData:assetDataUtils.encodeERC20AssetData("0xc4777287ddceb283ed6db59c88db5074f1b25e4e"),
            }
        ],
        currentChainData:undefined,
        decimal:18
    },
]

export default ERC20TokenList