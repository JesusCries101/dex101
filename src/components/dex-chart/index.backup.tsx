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

export class DexChart extends React.PureComponent<Props, ChartContainerState> {
	public static defaultProps: ChartContainerProps = {
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
	};

	private tvWidget: IChartingLibraryWidget | null = null;

	public componentDidMount(): void {
		const widgetOptions: ChartingLibraryWidgetOptions = {
			symbol: this.props.symbol as string,
			// BEWARE: no trailing slash is expected in feed URL
			// tslint:disable-next-line:no-any
			datafeed: makeDatafeed({canSearchSymbols: !this.props.isCurrencyPairLocked}),
			// datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(this.props.datafeedUrl),
			interval: this.props.interval as ChartingLibraryWidgetOptions['interval'],
			container_id: this.props.containerId as ChartingLibraryWidgetOptions['container_id'],
			library_path: this.props.libraryPath as string,

			locale: getLanguageFromURL() || 'en',
			disabled_features: ['use_localstorage_for_settings'],
			enabled_features: ['study_templates'],
			charts_storage_url: this.props.chartsStorageUrl,
			charts_storage_api_version: this.props.chartsStorageApiVersion,
			client_id: this.props.clientId,
			user_id: this.props.userId,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize,
			studies_overrides: this.props.studiesOverrides,
			theme: 'Dark',
		};
		
		const tvWidget = new widget(widgetOptions);
		this.tvWidget = tvWidget;
		
		tvWidget.onChartReady(() => {
			let chart = tvWidget.activeChart();
			chart.setChartType(2);
			chart.setResolution('1' as Nominal<string, "ResolutionString">, () => {});
			this.getDefaultCurrencyPair()
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
	}

	public componentWillUnmount(): void {
		if (this.tvWidget !== null) {
			this.tvWidget.remove();
			this.tvWidget = null;
		}
	}

	public render(): JSX.Element {
		return (
			<div>
				<div
					id={ this.props.containerId }
					className={ 'TVChartContainer' }
				/>
			</div>
		);
	}

	private getDefaultCurrencyPair() {
		return (
			this.props.currencyPair ?
			(currencyPair => (
				Promise.resolve()
					.then(() => ({
						assetBase: currencyPair.quote.toUpperCase(),
						assetQuote: currencyPair.base.toUpperCase(),
					}))
			))(this.props.currencyPair) :
			listAllSymbols().then(pairs => pairs[0])
		);
	}
}
