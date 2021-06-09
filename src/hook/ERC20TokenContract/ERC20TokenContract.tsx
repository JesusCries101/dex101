import React from 'react'
import { ERC20TokenContract } from '@0x/contract-wrappers';
import detectEthereumProvider from '@metamask/detect-provider';
import { useMetaMask } from 'metamask-react';
import {
	MetamaskSubprovider,
	Web3JsProvider,
} from '0x.js';
import {CoinData} from '../erc20Token'

export let useERC20TokenContract = () => {
	let [getErc20TokenContract, setGetErc20TokenContract] = React.useState<((token: CoinData) => ERC20TokenContract | null) | null>(null);
	let { account } = useMetaMask();
	
	React.useEffect(() => {
		if (account) {
			(account => (
				detectEthereumProvider()
					.then<Web3JsProvider>(_ => _ as any)
					.then(w3provider => {
						let providerEngine = new MetamaskSubprovider(w3provider);
						setGetErc20TokenContract(() => (token: CoinData) => (
							token && token.currentChainData ?
							new ERC20TokenContract(token.currentChainData.address, providerEngine, { from: account }) :
							null
						));
					})
					.catch(console.log)
			))(account);
		}
	}, [account]);
	return {
		account,
		getErc20TokenContract
	};
};