import {
	DatafeedConfiguration,
	IBasicDataFeed,
	Nominal
} from '../charting_library';
import {getBars, listAllSymbols} from './service';

let supportedResolutions = ['1', '3', '5', '15', '30', '60', '120', '240', '1D'] as Nominal<string, 'ResolutionString'>[];
let secondsByResolution: Record<Nominal<string, 'ResolutionString'>, number> = {
	'1': 60,
	'3': 180,
	'5': 300,
	'15': 900,
	'30': 1800,
	'60': 3600,
	'120': 7200,
	'240': 14400,
	'1D': 86400,
};

let datafeedConf: DatafeedConfiguration = {
	supported_resolutions: supportedResolutions,
};

let getSymbolDetail = (assetBase: string, assetQuote: string) => ({
	symbol: `${assetBase}/${assetQuote}`,
	full_name: `${assetBase}-${assetQuote}`,
	description: `description of ${assetBase}/${assetQuote}`,
	exchange: `exchange of ${assetBase}/${assetQuote}`,
	ticker: `${assetBase}/${assetQuote}`,
	type: 'crypto',
	pricescale: 1e5,
});

interface Conf {
	canSearchSymbols: boolean;
}
let makeDatafeed = (conf: Conf) => (
	(datafeed => (
		withBasicLogs(datafeed)
	))(<IBasicDataFeed> {
		onReady: (callback) => {
			callback(datafeedConf);
		},
		searchSymbols: (userInput, exchange, symbolType, searchSymbolsCallback) => {
			Promise.resolve()
				.then(() => (
					conf.canSearchSymbols ?
					listAllSymbols()
						.then(symbols => symbols.map(({assetQuote, assetBase}) => getSymbolDetail(assetBase, assetQuote))) :
					Promise.resolve([])
				))
				.then(searchSymbolsCallback)
				.catch(() => {});
		},
		resolveSymbol: (symbolName, resolveCallback, errorCallback) => {
			console.log(`symbolName: ${symbolName}`);
			resolveCallback({
				name: symbolName,
				//full_name: symbolName,
				//ticker: symbolName,
				//description: 'test symbol',
				//type: 'crypto',
				session: '24x7',
				//exchange: 'test exchange',
				listed_exchange: 'test exchange',
				timezone: 'Etc/UTC',
				format: 'price',
				//pricescale: 8,
				has_intraday: true,
				minmov: 1,
				supported_resolutions: supportedResolutions,
				...(getSymbolDetail(symbolName.split('/')[0], symbolName.split('/')[1])),
			});
		},
		getBars: (symbolInfo, resolution, rangeStartDate, rangeEndDate, historyCallback, errorCallback, isFirstCall) => {
			console.log(JSON.stringify({ symbolInfo, resolution, rangeStartDate, rangeEndDate }, null, 2));
			let timestampLen = rangeEndDate - rangeStartDate;
			let secondsInterval = secondsByResolution[resolution];
			let barCount = Math.ceil(timestampLen / secondsInterval);
			console.log(JSON.stringify({ timestampLen, secondsInterval, barCount }, null, 2));
			
			let [assetQuote, assetBase] = symbolInfo.name.split('/');

			getBars({
				assetQuote,
				assetBase,
				barCount,
				timestampFrom: rangeStartDate,
				timestampTo: rangeEndDate,
			})
				.catch(() => [])
				.then(bars => historyCallback(bars, { noData: false }))
				.catch(alert);
		},
		subscribeBars: (symbolInfo, resolution, subscribeBarsCallback, listenerGuid, resetCacheNeededCallback) => {
			//
		},
		unsubscribeBars: (listenerGuid) => {
			//
		},
	})
);

function withBasicLogs(datafeed: IBasicDataFeed): IBasicDataFeed {
	for (let key in datafeed) {
		if (key in datafeed) {
			let f = datafeed[key] as Function;
			datafeed[key] = (...as: any[]) => (
				console.log(`enter method "${key}"`),
				(ret => (
					console.log(`leave method "${key}"`),
					ret
				))(f(...as))
			);
		}
	}
	return datafeed;
}

export default makeDatafeed;
export {
	listAllSymbols,
}