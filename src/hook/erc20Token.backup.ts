import {
	assetDataUtils,
	BigNumber,

} from '0x.js';

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
            throw new Error('getLimitBuySellTokens');
        }
    ))({
        'fau': 'FAU',
		'bkr': 'BKR(STO)',
		'fst': 'FST(STO)'
    })
);

const ERC20TokenList: CoinData[] = [
	{
		name: "FAU",
		chains: [
			{
				chainId: 42,
				address: "0xFab46E002BbF0b4509813474841E0716E6730136",
				assetData: assetDataUtils.encodeERC20AssetData("0xFab46E002BbF0b4509813474841E0716E6730136"),
			},
			{
				chainId: 1,
				address: "0xfab46e002bbf0b4509813474841e0716e6730136",
				assetData: assetDataUtils.encodeERC20AssetData("0xfab46e002bbf0b4509813474841e0716e6730136"),
			}
		],
		currentChainData: undefined,
		decimal: 18
	},
	{
		name: "DAI",
		chains: [
			{
				chainId: 42,
				address: "0xff795577d9ac8bd7d90ee22b6c1703490b6512fd",
				assetData: assetDataUtils.encodeERC20AssetData("0xff795577d9ac8bd7d90ee22b6c1703490b6512fd"),
			}
		],
		currentChainData: undefined,
		decimal: 18
	},
	{
		name: "BKR(STO)",
		chains: [
			{
				chainId: 1,
				address: "0xc4777287ddceb283ed6db59c88db5074f1b25e4e",
				assetData: assetDataUtils.encodeERC20AssetData("0xc4777287ddceb283ed6db59c88db5074f1b25e4e"),
			}
		],
		currentChainData: undefined,
		decimal: 18
	},
	{
		name: "FST(STO)",
		chains: [
			{
				chainId: 1,
				address: "0x6d1c15725e3979f654bd929e1ccad48708bd4284",
				assetData: assetDataUtils.encodeERC20AssetData("0x6d1c15725e3979f654bd929e1ccad48708bd4284"),
			}
		],
		currentChainData: undefined,
		decimal: 18
	},
];

export let getERC20Token = (name: string): CoinData | null => (
	ERC20TokenList.find(_ => name === _.name) || null
);

export default ERC20TokenList