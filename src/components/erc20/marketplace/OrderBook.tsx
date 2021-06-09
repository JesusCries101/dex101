import { BigNumber } from '@0x/utils';
import React from 'react';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';

import {
    UI_DECIMALS_DISPLAYED_ORDER_SIZE,
    UI_DECIMALS_DISPLAYED_PRICE_ETH,
    UI_DECIMALS_DISPLAYED_SPREAD_PERCENT,
    ZERO,
} from '../../../common/constants';
import {
    getBaseToken,
    getQuoteToken,
    getWeb3State,
    getCurrencyPair,
} from '../../../store/selectors';
import { setOrderPriceSelected } from '../../../store/ui/actions';
import { Theme, themeBreakPoints } from '../../../themes/commons';
import { tokenAmountInUnits } from '../../../util/tokens';
import { OrderBook, OrderBookItem, OrderSide, StoreState, Token, UIOrder, Web3State, CurrencyPair } from '../../../util/types';
import { Card } from '../../common/card';
import { EmptyContent } from '../../common/empty_content';
import { LoadingWrapper } from '../../common/loading';
import { ShowNumberWithColors } from '../../common/show_number_with_colors';
import { CustomTD, CustomTDLast, CustomTDTitle, TH, THLast } from '../../common/table';

import {
    customTDLastStyles,
    customTDStyles,
    customTDTitleStyles,
    GridRowSpread,
    GridRowSpreadContainer,
    StickySpreadState,
} from './grid_row_spread';

import {getTokenName} from '../../../hook/erc20Token'
import {useContractWrappers} from '../../../hook/ContractWrappers'
import {assetDataUtils} from '0x.js'
import {useMetaMask} from 'metamask-react'
import { getOrderBookZeroX, OrderBookHook } from '../../../hook/SortedOrderBook';

interface StateProps {
    baseToken: Token | null;
    quoteToken: Token | null;
    web3State?: Web3State;
    currencyPair: CurrencyPair;
}

interface OwnProps {
    theme: Theme;
}

type Props = OwnProps & StateProps & {
    orderBookHook: OrderBookHook;
    triggerOrderSubmitted: boolean;
};

const OrderbookCard = styled(Card)`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    max-height: 100%;

    > div:first-child {
        flex-grow: 0;
        flex-shrink: 0;
    }

    > div:nth-child(2) {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        overflow: hidden;
        padding-bottom: 0;
        padding-left: 0;
        padding-right: 0;
    }
`;

const GridRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
`;

const GridRowInner = styled(GridRow)`
    background-color: 'transparent';
    cursor: pointer;
    &:hover {
        background-color: ${props => props.theme.componentsTheme.rowOrderActive};
    }
`;

const GridRowTop = styled(GridRow)`
    flex-grow: 0;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
`;

const CenteredLoading = styled(LoadingWrapper)`
    height: 100%;
`;

const ItemsScroll = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    max-height: 500px;
    overflow: auto;

    @media (min-width: ${themeBreakPoints.xl}) {
        max-height: none;
    }
`;

const ItemsMainContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    min-height: fit-content;
    position: relative;
    z-index: 1;
`;

const ItemsInnerContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-shrink: 1;
`;

const TopItems = styled(ItemsInnerContainer)`
    justify-content: flex-end;
`;

const BottomItems = styled(ItemsInnerContainer)`
    justify-content: flex-start;
`;

interface OrderToRowPropsOwn {
    side: 'bid' | 'ask';
    order: OrderBookItem;
    index: number;
    count: number;
    baseToken: Token;
    quoteToken: Token;
    priceColor: string;
    mySizeOrders: OrderBookItem[];
    web3State?: Web3State;
}

interface OrderToRowDispatchProps {
    onSetOrderPriceSelected: (orderPriceSelected: BigNumber) => Promise<any>;
}

type OrderToRowProps = OrderToRowPropsOwn & OrderToRowDispatchProps;

interface State {
    isHover: boolean;
}

class OrderToRow extends React.Component<OrderToRowProps> {
    public state: State = {
        isHover: false,
    };

    public hoverOn = () => {
        this.setState({ isHover: true });
    };

    public hoverOff = () => {
        this.setState({ isHover: false });
    };

    public render = () => {
        const { side, order, index, baseToken, quoteToken, priceColor, mySizeOrders = [], web3State } = this.props;
        
        let size = '';
        if (side === 'bid') {
            size = tokenAmountInUnits(order.size, baseToken.decimals, UI_DECIMALS_DISPLAYED_ORDER_SIZE);
        } else {
            size = tokenAmountInUnits(order.size, quoteToken.decimals, UI_DECIMALS_DISPLAYED_ORDER_SIZE);
        }
        
        const price = order.price.toString();

        const mySize = mySizeOrders.reduce((sumSize, mySizeItem) => {
            if (mySizeItem.price.eq(order.price)) {
                return sumSize.plus(mySizeItem.size);
            }
            return sumSize;
        }, ZERO);

        let mySizeConverted = '';
        if (side === 'bid') {
            mySizeConverted = tokenAmountInUnits(mySize, baseToken.decimals, UI_DECIMALS_DISPLAYED_ORDER_SIZE);
        } else {
            mySizeConverted = tokenAmountInUnits(mySize, quoteToken.decimals, UI_DECIMALS_DISPLAYED_ORDER_SIZE);
        }

        const isMySizeEmpty = mySize.eq(ZERO);
        const displayColor = isMySizeEmpty ? '#dedede' : undefined;
        const mySizeRow =
            web3State !== Web3State.Locked && web3State !== Web3State.NotInstalled ? (
                <CustomTDLast as="div" styles={{ tabular: true, textAlign: 'right', color: displayColor }} id="mySize">
                    {isMySizeEmpty ? '-' : mySizeConverted}
                </CustomTDLast>
            ) : null;

        return (
            <GridRowInner
                key={index}
                onMouseEnter={this.hoverOn}
                onMouseLeave={this.hoverOff}
                // tslint:disable-next-line jsx-no-lambda
                onClick={() => this._setOrderPriceSelected(order.price)}
            >
                <CustomTD as="div" styles={{ tabular: true, textAlign: 'right' }}>
                    <ShowNumberWithColors isHover={this.state.isHover} num={new BigNumber(size)} />
                </CustomTD>
                <CustomTD as="div" styles={{ tabular: true, textAlign: 'right', color: priceColor }}>
                    {parseFloat(price).toFixed(UI_DECIMALS_DISPLAYED_PRICE_ETH)}
                </CustomTD>
                {mySizeRow}
            </GridRowInner>
        );
    };

    private readonly _setOrderPriceSelected = async (size: BigNumber) => {
        await this.props.onSetOrderPriceSelected(size);
    };
}

const mapOrderToRowDispatchToProps = (dispatch: any): OrderToRowDispatchProps => {
    return {
        onSetOrderPriceSelected: (orderPriceSelected: BigNumber) => dispatch(setOrderPriceSelected(orderPriceSelected)),
    };
};

const OrderToRowContainer = connect(
    null,
    mapOrderToRowDispatchToProps,
)(OrderToRow);

let OrderBookTable = (props: Props) => {
	let _spreadRowScrollable: React.RefObject<HTMLDivElement> = React.createRef();
	let _spreadRowFixed: React.RefObject<GridRowSpread> = React.createRef();
	let _itemsScroll: React.RefObject<HTMLDivElement> = React.createRef();
    let _hasScrolled = false;

    let [orderBook, setOrderBook] = React.useState<OrderBook>({buyOrders: [], sellOrders: [], mySizeOrders: []})
    let {account} = useMetaMask();

    React.useEffect(() => {
        if (account) {
            setOrderBook(getOrderBookZeroX(props.orderBookHook.orderBook, account));
        }
    }, [account, props.orderBookHook.orderBook]);

    let {absoluteSpread, percentageSpread} = (
        ((asks = orderBook.sellOrders, bids = orderBook.buyOrders) => (
            ((absoluteSpread, percentageSpread = absoluteSpread.comparedTo(new BigNumber(0)) == 0 ? new BigNumber(0) : absoluteSpread.div(asks[asks.length - 1].price).multipliedBy(new BigNumber(100))) => ({
                absoluteSpread, percentageSpread
            }))(
                asks.length == 0 || bids.length == 0 ? new BigNumber(0) : (
                    asks[asks.length - 1].price.minus(bids[0].price)
                )
            )
        ))()
    );

	const { baseToken, quoteToken, web3State, theme } = props;
	const { sellOrders, buyOrders, mySizeOrders } = orderBook;
	const mySizeSellArray = mySizeOrders.filter((order: { side: OrderSide }) => {
		return order.side === OrderSide.Sell;
	});
	const mySizeBuyArray = mySizeOrders.filter((order: { side: OrderSide }) => {
		return order.side === OrderSide.Buy;
	});
	const getColor = (order: OrderBookItem): string => {
		return order.side === OrderSide.Buy ? theme.componentsTheme.green : theme.componentsTheme.red;
	};

	let _refreshStickySpreadOnItemsListUpdate = () => {
		if (_spreadRowFixed.current && _hasScrolled) {
			_spreadRowFixed.current.updateStickSpreadState(_getStickySpreadState(), _getSpreadWidth());
		}
	};

	let _getSpreadWidth = (): string => {
		return _itemsScroll.current ? `${_itemsScroll.current.clientWidth}px` : '';
	};

	let _getSpreadOffsetTop = (): number => {
		return _spreadRowScrollable.current ? _spreadRowScrollable.current.offsetTop : 0;
	};

	let _getSpreadHeight = (): number => {
		return _spreadRowScrollable.current ? _spreadRowScrollable.current.clientHeight : 0;
	};

	let _getItemsListScroll = (): number => {
		return _itemsScroll.current ? _itemsScroll.current.scrollTop : 0;
	};

	let _getItemsListHeight = (): number => {
		return _itemsScroll.current ? _itemsScroll.current.clientHeight : 0;
	};

	let _getStickySpreadState = (): StickySpreadState => {
		const spreadOffsetTop = _getSpreadOffsetTop();
		const itemsListScroll = _getItemsListScroll();
		const topLimit = 0;

		if (spreadOffsetTop - itemsListScroll <= topLimit) {
			return 'top';
		} else if (itemsListScroll + _getItemsListHeight() - _getSpreadHeight() <= spreadOffsetTop) {
			return 'bottom';
		} else {
			return 'hidden';
		}
	};

	let _updateStickySpreadState = () => {
		if (_spreadRowFixed.current) {
			_spreadRowFixed.current.updateStickSpreadState(_getStickySpreadState(), _getSpreadWidth());
		}
	};

	let _scrollToSpread = () => {
		const { current } = _spreadRowScrollable;

		// avoid scrolling for tablet sized screens and below
		if (window.outerWidth < parseInt(themeBreakPoints.xl, 10)) {
			return;
		}

		if (current && !_hasScrolled) {
			// tslint:disable-next-line:no-unused-expression
			current.scrollIntoView && current.scrollIntoView({ block: 'center', behavior: 'smooth' });
			_hasScrolled = true;
		}
	};

	let content: React.ReactNode;

	if (web3State !== Web3State.Error && (!baseToken || !quoteToken)) {
		content = <CenteredLoading />;
	} else if ((!buyOrders.length && !sellOrders.length) || !baseToken || !quoteToken) {
		content = <EmptyContent alignAbsoluteCenter={true} text="There are no orders to show" />;
	} else {
		const mySizeHeader =
			web3State !== Web3State.Locked && web3State !== Web3State.NotInstalled ? (
				<THLast as="div" styles={{ textAlign: 'right', borderBottom: true }}>
					My Size
                    </THLast>
			) : null;

		const spreadAbsFixed = absoluteSpread.toFixed(UI_DECIMALS_DISPLAYED_PRICE_ETH);
		let spreadPercentFixed = percentageSpread.toFixed(UI_DECIMALS_DISPLAYED_SPREAD_PERCENT);
                
		content = (
			<>
				<GridRowTop as="div">
					<TH as="div" styles={{ textAlign: 'right', borderBottom: true }}>
						Trade size
                        </TH>
					<TH as="div" styles={{ textAlign: 'right', borderBottom: true }}>
						Price ({quoteToken.symbol})
                        </TH>
					{mySizeHeader}
				</GridRowTop>
				<ItemsScroll ref={_itemsScroll} onScroll={_updateStickySpreadState}>
					<GridRowSpread
						ref={_spreadRowFixed}
						spreadAbsValue={spreadAbsFixed}
						spreadPercentValue={spreadPercentFixed}
					/>
					<ItemsMainContainer>
						<TopItems>
							{sellOrders.map((order, index) => ( 
								<OrderToRowContainer
                                    side={'ask'}
									key={index}
									order={order}
									index={index}
									count={sellOrders.length}
                                    baseToken={baseToken}
                                    quoteToken={quoteToken}
									priceColor={getColor(order)}
									mySizeOrders={mySizeSellArray}
									web3State={web3State}
								/>
							))}
						</TopItems>
						<GridRowSpreadContainer ref={_spreadRowScrollable}>
							<CustomTDTitle as="div" styles={customTDTitleStyles}>
								Spread
                                </CustomTDTitle>
							<CustomTD as="div" styles={customTDStyles}>
								{spreadAbsFixed}
							</CustomTD>
							<CustomTDLast as="div" styles={customTDLastStyles}>
								{spreadPercentFixed}%
                                </CustomTDLast>
						</GridRowSpreadContainer>
						<BottomItems>
							{buyOrders.map((order, index) => (
								<OrderToRowContainer
                                    side={'bid'}
									key={index}
									order={order}
									index={index}
									count={buyOrders.length}
                                    baseToken={baseToken}
                                    quoteToken={quoteToken}
									priceColor={getColor(order)}
									mySizeOrders={mySizeBuyArray}
									web3State={web3State}
								/>
							))}
						</BottomItems>
					</ItemsMainContainer>
				</ItemsScroll>
			</>
		);
	}

	React.useEffect(() => {
		_refreshStickySpreadOnItemsListUpdate();
		_scrollToSpread();
    }, []);

	return <OrderbookCard title="Orderbook">{content}</OrderbookCard>;
};

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        baseToken: getBaseToken(state),
        quoteToken: getQuoteToken(state),
        web3State: getWeb3State(state),
        currencyPair: getCurrencyPair(state),
    };
};

const OrderBookTableContainer = withTheme(connect(mapStateToProps)(OrderBookTable));
const OrderBookTableWithTheme = withTheme(OrderBookTable);

export { OrderBookTable, OrderBookTableWithTheme, OrderBookTableContainer };
