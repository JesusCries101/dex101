let headers = {
	'Content-Type': 'application/json',
	'auth-token': 'admin@gmail.com:password'
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace GetBars {
	export interface Conf {
		assetQuote: string;
		assetBase: string;
		barCount: number;
		timestampFrom: number;
		timestampTo: number;
	}
}
export let getBars = ({
	assetQuote, assetBase, barCount, timestampFrom, timestampTo
}: GetBars.Conf) => (
	fetch(`/api/v1/admin/sampled/asset_swaps/?assetQuote=Equal("${assetQuote}")&assetBase=Equal("${assetBase}")`, {
		method: 'POST',
		headers,
		body: JSON.stringify({
			'count': barCount,
			'timestampFrom': timestampFrom,
			'timestampTo': timestampTo
		})
	})
		.then(res => res.json())
		.then(res => typeof res.err === 'string' ? Promise.reject(new Error(res.err)) : res)
		.then(bars => (
			bars
				.map((bar: any) => (price => ({
					time: bar.timestamp * 1e3,
					low: price * (1 - 1e-3),
					high: price * (1 + 1e-3),
					open: price,
					close: price,
				}))(parseFloat(bar.price)))
		))
);

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace ListAllSymbols {
	export type Ret = {
		assetQuote: string;
		assetBase: string;
	}[]
}
export let listAllSymbols = (): Promise<ListAllSymbols.Ret> => (
	new Promise<any>((resolve, reject) => {
		(function listAllSymbols() {
			fetch('/api/v1/admin/asset_swap/token_pairs', {
				headers,
			})
				.then(res => (
					res.json()
						.then(res => {
							if (typeof res.err === 'string') {
								reject(new Error(res.err));
							} else {
								resolve(res);
							}
						})
						.catch(() => new Promise(r => setTimeout(r, 1e3)).then(listAllSymbols))
				))
		})();
	})
);