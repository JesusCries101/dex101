import React from 'react'
import {CoinData} from '../erc20Token'
import {useERC20TokenContract} from '../ERC20TokenContract'
import {
	BigNumber,
} from '0x.js'
import * as ethers from 'ethers'

export let exchangeProxyAddress = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';
let usdtAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7';
let usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
let specialTokens = [usdtAddress, usdcAddress].map(_ => _.toLowerCase());

let unlockSpecial = async (address: string, account: string) => {
	let abi = ["function approve(address _spender, uint256 _value)"]
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	const signer = provider.getSigner()
	const _contract = new ethers.Contract(address, abi, signer)
	await _contract.approve(exchangeProxyAddress, new BigNumber(Math.pow(2, 255)).toString(), {from: account})
};

export let useAssetUnlock = () => {
	let {account, getErc20TokenContract} = useERC20TokenContract();
	let [unlockAsset, setUnlockAsset] = React.useState<((token: CoinData) => Promise<void>) | null>(null);
	let [getAllowance, setGetAllowance] = React.useState<((token: CoinData) => Promise<BigNumber>) | null>(null);

	React.useEffect(() => {
		if (account && getErc20TokenContract) {
			((from, getErc20TokenContract) => {
				setUnlockAsset(() => (token: CoinData) => (
					token.currentChainData && ((chain = token.currentChainData) => specialTokens.some(_ => _ === chain.address.toLowerCase()))() ? (
						Promise.resolve()
							.then(() => unlockSpecial(token.currentChainData!.address, from))
					) : (
						Promise.resolve()
							.then(() => getErc20TokenContract(token))
							.then(tokenContract => (
								!tokenContract ? Promise.reject(new Error('unlockAsset')) : (
									tokenContract.approve(exchangeProxyAddress, new BigNumber(Math.pow(2, 255)))
										.sendTransactionAsync({ 
											from, 
											gas: 70000,
										})
										.then(() => {})
								)
							))
					)
				));
				setGetAllowance(() => (token: CoinData) => (
					Promise.resolve()
						.then(() => getErc20TokenContract(token))
						.then(tokenContract => (
							!tokenContract ? Promise.reject(new Error('getAllowance')) : (
								tokenContract.allowance(from, exchangeProxyAddress)
									.callAsync()
							)
						))
				));
			})(account, getErc20TokenContract);
		}
	}, [account, getErc20TokenContract]);

	return {
		unlockAsset,
		getAllowance,
	};
};