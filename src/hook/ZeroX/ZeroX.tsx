import * as ethers from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'
import React from 'react'
import {ZeroEx} from '../../ethers-contracts/zerox/ZeroEx'
import abi from '../../contract/abi/zerox/ZeroEx.json'
import {BigNumberish} from '@ethersproject/bignumber'
import {BytesLike} from '@ethersproject/bytes'
import { OrderBookSingleOrder } from '../SortedOrderBook'
import {
	BigNumber
} from '0x.js'

let exchangeProxyAddress = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';

export let useZeroX = () => {
	let [zerox, setZerox] = React.useState<ZeroEx | null>(null);
	let [gasPrice, setGasPrice] = React.useState<BigNumber | null>(null);
	
	React.useEffect(() => {
		detectEthereumProvider()
			.then(_ => _ as any)
			.then(web3 => new ethers.providers.Web3Provider(web3))
			.then(provider => (
				provider.getGasPrice()
					.then(gasPrice => ({
						gasPrice,
						zerox: (
							new ethers.Contract(
								exchangeProxyAddress, 
								abi,
								provider.getSigner()
							) as ZeroEx
						) 
					}))
			)) 
			.then(({zerox, gasPrice}) => {
				setZerox(zerox);
				setGasPrice(
					new BigNumber(
						new BigNumber(gasPrice.toString()).plus(10e9).div(new BigNumber(1e9)).toFixed(0)
					).multipliedBy(new BigNumber(1e9))
				);
			})
			.catch(alert);
	}, []);
	
	return {zerox, gasPrice};
};

export type ZeroX = ReturnType<typeof useZeroX>;

interface OrderZeroX {
	makerToken: string;
	takerToken: string;
	makerAmount: BigNumberish;
	takerAmount: BigNumberish;
	takerTokenFeeAmount: BigNumberish;
	maker: string;
	taker: string;
	sender: string;
	feeRecipient: string;
	pool: BytesLike;
	expiry: BigNumberish;
	salt: BigNumberish;
  }

export let getOrderZeroX = (order: OrderBookSingleOrder): OrderZeroX => ({
	makerToken: order.order.makerToken,
	takerToken: order.order.takerToken,
	makerAmount: order.order.makerAmount.toString(),
	takerAmount: order.order.takerAmount.toString(),
	takerTokenFeeAmount: order.order.takerTokenFeeAmount.toString(),
	maker: order.order.maker,
	taker: order.order.taker,
	sender: order.order.taker,
	feeRecipient: order.order.feeRecipient,
	pool: order.order.pool,
	expiry: order.order.expiry.toString(),
	salt: order.order.salt.toString(),
});