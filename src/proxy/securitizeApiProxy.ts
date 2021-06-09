export interface ValidResp<T = any> {
    res: any;
}

export interface ErrorResp {
    err: any;
}

export let isErrorResp = (resp: any): resp is ErrorResp => typeof resp.err !== 'undefined';

export interface Registration {
	token: string;
	walletAddress: string;
	step: 'begin' | 'createInvestor' | 'registerInvestor' | 'isInvestor' | 'addWallet' | 'end';
	status: 'incomplete' | 'pending' | 'accepted' | 'rejected';
	lock: 'active' | 'inactive';
	blockchainID: string | null;
	registerInvestorTXID: string | null;
	addWalletTXID: string | null;
}

export interface Resps {
    '/investor/:walletAddress/': ErrorResp | ValidResp<{
        blockchainID: string;
    }>;
    '/investor/detail/:token/:walletAddress/': ErrorResp | ValidResp<Registration>;
    'POST/investor/': ErrorResp | ValidResp;
}

export type VerificationStatus = 'fetching' | 'verified' | 'pending';

let fetch_ = (
    (headers => (
        <typeof fetch>((relativePath, init = {}) => (
            fetch(`/dsprotocol/api/v1${relativePath}`, Object.assign(init, {headers}))
        ))
    ))({
        'authorization': process.env.REACT_APP_SECURITIZE_API_KEY,
		'content-type': 'application/json',
    })
);
export default fetch_
export {fetch_ as fetch}