import detectEthereumProvider from '@metamask/detect-provider'

export interface EthereumProvider {
	selectedAddress: string;
}

interface PartialEthereumProvider {
	selectedAddress: string | null;
}

let detectProvider = () => (
	new Promise<EthereumProvider>((resolve, reject) => {
		(function detectProvider() {
			detectEthereumProvider()
				.then<PartialEthereumProvider>((_: any) => _)
				.then(ethereum => {
					if (ethereum.selectedAddress) {
						resolve(<EthereumProvider>ethereum);
					} else {
						new Promise(resolve => setTimeout(resolve, 1e3))
							.then(detectProvider)
							.catch(reject);
					}
				})
				.catch(reject)
		})();
	})
);

export default detectProvider
export {
	detectProvider as detectEthereumProvider
}