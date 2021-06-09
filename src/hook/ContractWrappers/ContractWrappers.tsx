import detectEthereumProvider from '@metamask/detect-provider'
import {
    Web3JsProvider,
    MetamaskSubprovider,
} from '0x.js'
import {ContractWrappers} from '@0x/contract-wrappers'
import React from 'react'
import {useMetaMask} from 'metamask-react'

export let useContractWrappers = () => {
    let [contractWrappers, setContractWrappers] = React.useState<ContractWrappers | null>(null);
    let {chainId, account} = useMetaMask();

    React.useEffect(() => {
        if (chainId) {
            (chainId => (
                detectEthereumProvider()
                    .then<Web3JsProvider>(_ => _ as any)
                    .then(w3provider => {
                        let providerEngine = new MetamaskSubprovider(w3provider);
                        let contractWrappers = new ContractWrappers(providerEngine, { chainId });
                        setContractWrappers(contractWrappers);
                    })
                    .catch(console.log)
            ))(parseInt(chainId, 16));
        }
    }, [chainId]);
    return {
        account,
        contractWrappers
    };
};