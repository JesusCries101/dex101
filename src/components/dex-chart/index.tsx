import * as React from 'react';
import './index.css';
import {
	widget,
	ChartingLibraryWidgetOptions,
	LanguageCode,
	IChartingLibraryWidget,
	ResolutionString,
	Nominal,
} from '../../charting_library';
import makeDatafeed from '../../datafeed';
import {listAllSymbols} from '../../datafeed';
import {
	CurrencyPair
} from '../../util/types'


export interface ChartContainerProps {
	symbol: ChartingLibraryWidgetOptions['symbol'];
	interval: ChartingLibraryWidgetOptions['interval'];
	datafeedUrl: string;
	libraryPath: ChartingLibraryWidgetOptions['library_path'];
	chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'];
	chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];
	clientId: ChartingLibraryWidgetOptions['client_id'];
	userId: ChartingLibraryWidgetOptions['user_id'];
	fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
	autosize: ChartingLibraryWidgetOptions['autosize'];
	studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
	containerId: ChartingLibraryWidgetOptions['container_id'];
}

export interface ChartContainerState {
}

function getLanguageFromURL(): LanguageCode | null {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode;
}

type Props = Partial<ChartContainerProps> & {
	currencyPair?: CurrencyPair;
	isCurrencyPairLocked: boolean;
};

export let DexChart = Object.assign(
	(props: Props) => {
		function getDefaultCurrencyPair() {
			return (
				props.currencyPair ?
				(currencyPair => (
					Promise.resolve()
						.then(() => ({
							assetBase: currencyPair.quote.toUpperCase(),
							assetQuote: currencyPair.base.toUpperCase(),
						}))
				))(props.currencyPair) :
				listAllSymbols().then(pairs => pairs[0])
			);
		}
	
		React.useEffect(() => {
			const widgetOptions: ChartingLibraryWidgetOptions = {
				symbol: props.symbol as string,
				// BEWARE: no trailing slash is expected in feed URL
				// tslint:disable-next-line:no-any
				datafeed: makeDatafeed({canSearchSymbols: !props.isCurrencyPairLocked}),
				// datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(this.props.datafeedUrl),
				interval: props.interval as ChartingLibraryWidgetOptions['interval'],
				container_id: props.containerId as ChartingLibraryWidgetOptions['container_id'],
				library_path: props.libraryPath as string,
	
				locale: getLanguageFromURL() || 'en',
				disabled_features: ['use_localstorage_for_settings'],
				enabled_features: ['study_templates'],
				charts_storage_url: props.chartsStorageUrl,
				charts_storage_api_version: props.chartsStorageApiVersion,
				client_id: props.clientId,
				user_id: props.userId,
				fullscreen: props.fullscreen,
				autosize: props.autosize,
				studies_overrides: props.studiesOverrides,
				theme: 'Light',
			};
			
			let tvWidget = new widget(widgetOptions);
	
			tvWidget.onChartReady(() => {
				let chart = tvWidget.activeChart();
				chart.setChartType(2);
				chart.setResolution('1' as Nominal<string, "ResolutionString">, () => {});
				getDefaultCurrencyPair()
					.then(({assetBase, assetQuote}) => `${assetQuote}/${assetBase}`)
					.then(symbol => chart.setSymbol(symbol, () => {}))
					.catch(() => {});
	
				tvWidget.headerReady().then(() => {
					const button = tvWidget.createButton();
					button.setAttribute('title', 'Click to show a notification popup');
					button.classList.add('apply-common-tooltip');
					button.addEventListener('click', () => tvWidget.showNoticeDialog({
							title: 'Notification',
							body: 'TradingView Charting Library API works correctly',
							callback: () => {
								console.log('Noticed!');
							},
						}));
					button.innerHTML = 'Check API';
				});
			});
	
			return () => {
				tvWidget.remove();
			};
		}, [props.currencyPair]);
		return (
			<div>
				<div
					id={ props.containerId }
					className={ 'TVChartContainer' }
				/>
			</div>
		);
	}, {
		defaultProps: ({
			symbol: 'DEF',
			interval: 'D' as ResolutionString,
			containerId: 'tv_chart_container',
			datafeedUrl: 'https://demo_feed.tradingview.com',
			libraryPath: '/charting_library/',
			chartsStorageUrl: 'https://saveload.tradingview.com',
			chartsStorageApiVersion: '1.1',
			clientId: 'tradingview.com',
			userId: 'public_user_id',
			fullscreen: false,
			autosize: true,
			studiesOverrides: {},
		} as ChartContainerProps)
	}
);