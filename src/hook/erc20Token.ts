import {
	assetDataUtils,
	BigNumber,

} from '0x.js';
import globalConf from '../config.json'

export interface ChainData {
	chainId: number,
	address: string
	assetData: string
}

export interface CoinData {
	name: string
	chains: ChainData[]
	currentChainData: ChainData | undefined
	decimal: number
}
export interface CoinPair {
	quoteAsset: CoinData
	baseAsset: CoinData
	minUnitPrice: BigNumber
	maxUnitPrice: BigNumber
	averageUnitPrice: BigNumber
	totalVolumn: BigNumber
}

export let getTokenName = (
    (map => (
        (zeroXToken: string) => {
            if (zeroXToken in map) {
                return map[zeroXToken];
            }
            throw new Error('getTokenName');
        }
    ))(
		globalConf.tokens
			.reduce((acc, token) => (
				Object.assign(acc, {[token.symbol]: token.symbol})
			), <Record<string, string>>{})
	)
);

export const ERC20TokenList: CoinData[] = (
	globalConf.tokens
		.map(({symbol, addresses, decimals}) => (<CoinData>{
			name: symbol,
			chains: (
				Object.keys(addresses)
					.map(chainID => {
						let address = addresses[chainID] as string;
						address = address.toLowerCase();
						return <CoinData['chains'][number]>{
							chainId: parseInt(chainID),
							address,
							assetData: assetDataUtils.encodeERC20AssetData(address),
						};
					})
			),
			currentChainData: undefined,
			decimal: decimals,
		}))
);


export let getERC20Token = (name: string): CoinData | null => (
	ERC20TokenList.find(_ => name === _.name) || null
);

export let getERC20TokenByAddress = (address: string): CoinData | null => (
	((coin = ERC20TokenList.find(({currentChainData}) => !currentChainData ? false : currentChainData.address === address.toLowerCase())) => (
		coin || null
	))()
);

export let getMultipler = (baseDecimal: number, quoteDecimal: number) => (
	new BigNumber(10).pow(new BigNumber(baseDecimal - quoteDecimal))
	//new BigNumber(Math.pow(10, baseDecimal - quoteDecimal))
);

export default ERC20TokenList