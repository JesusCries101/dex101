import { BigNumber } from '@0x/utils';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { ZERO } from '../../../common/constants';
import { initWallet, startBuySellLimitSteps } from '../../../store/actions';
import { 
	getCurrencyPair, 
	getOrderPriceSelected, 
	getWeb3State,
	getBaseTokenBalance,
	getQuoteTokenBalance,
} from '../../../store/selectors';
import { themeDimensions } from '../../../themes/commons';
import { getKnownTokens } from '../../../util/known_tokens';
import { tokenSymbolToDisplayString } from '../../../util/tokens';
import {
	ButtonIcons,
	ButtonVariant,
	CurrencyPair,
	OrderFeeData,
	OrderSide,
	OrderType,
	StoreState,
	Web3State,
	TokenBalance,
} from '../../../util/types';
import { BigNumberInput } from '../../common/big_number_input';
import { Button } from '../../common/button';
import { CardBase } from '../../common/card_base';
import { CardTabSelector } from '../../common/card_tab_selector';
import { ErrorCard, ErrorIcons, FontSize } from '../../common/error_card';

import { OrderDetailsContainer } from './order_details';
import {useLimitBuySell, LimitBuySellHook} from '../../../hook/LimitBuySell'
import {getTokenName, getMultipler} from '../../../hook/erc20Token'
import {useAlertDialog} from '../../../hook/AlertDialog'
import { OrderBookHook } from '../../../hook/SortedOrderBook';

interface StateProps {
	web3State: Web3State;
	currencyPair: CurrencyPair;
	orderPriceSelected: BigNumber | null;
	baseTokenBalance: TokenBalance | null;
	quoteTokenBalance: TokenBalance | null;
}

interface DispatchProps {
	onConnectWallet: () => any;
}

type Props = StateProps & DispatchProps & {
	orderBookHook: OrderBookHook | null;
	buySellHook: LimitBuySellHook;
	toggleTriggerOrderSubmitted: () => void;
	isUnlocked: boolean;
};

interface State {
	makerAmount: BigNumber | null;
	orderType: OrderType;
	price: BigNumber | null;
	tab: OrderSide;
	error: {
		btnMsg: string | null;
		cardMsg: string | null;
	};
}

const BuySellWrapper = styled(CardBase)`
    margin-bottom: ${themeDimensions.verticalSeparationSm};
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px ${themeDimensions.horizontalPadding};
`;

const TabsContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
`;

const TabButton = styled.div<{ isSelected: boolean; side: OrderSide }>`
    align-items: center;
    background-color: ${props =>
		props.isSelected ? 'transparent' : props.theme.componentsTheme.inactiveTabBackgroundColor};
    border-bottom-color: ${props => (props.isSelected ? 'transparent' : props.theme.componentsTheme.cardBorderColor)};
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-right-color: ${props => (props.isSelected ? props.theme.componentsTheme.cardBorderColor : 'transparent')};
    border-right-style: solid;
    border-right-width: 1px;
    color: ${props =>
		props.isSelected
			? props.side === OrderSide.Buy
				? props.theme.componentsTheme.green
				: props.theme.componentsTheme.red
			: props.theme.componentsTheme.textLight};
    cursor: ${props => (props.isSelected ? 'default' : 'pointer')};
    display: flex;
    font-weight: 600;
    height: 47px;
    justify-content: center;
    width: 50%;

    &:first-child {
        border-top-left-radius: ${themeDimensions.borderRadius};
    }

    &:last-child {
        border-left-color: ${props => (props.isSelected ? props.theme.componentsTheme.cardBorderColor : 'transparent')};
        border-left-style: solid;
        border-left-width: 1px;
        border-right: none;
        border-top-right-radius: ${themeDimensions.borderRadius};
    }
`;

const LabelContainer = styled.div`
    align-items: flex-end;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
`;

const Label = styled.label<{ color?: string }>`
    color: ${props => props.color || props.theme.componentsTheme.textColorCommon};
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    margin: 0;
`;

const InnerTabs = styled(CardTabSelector)`
    font-size: 14px;
`;

const FieldContainer = styled.div`
    height: ${themeDimensions.fieldHeight};
    margin-bottom: 25px;
    position: relative;
`;

const BigInputNumberStyled = styled<any>(BigNumberInput)`
    background-color: ${props => props.theme.componentsTheme.textInputBackgroundColor};
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.textInputBorderColor};
    color: ${props => props.theme.componentsTheme.textInputTextColor};
    font-feature-settings: 'tnum' 1;
    font-size: 16px;
    height: 100%;
    padding-left: 14px;
    padding-right: 60px;
    position: absolute;
    width: 100%;
    z-index: 1;
`;

const TokenContainer = styled.div`
    display: flex;
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 12;
`;

const TokenText = styled.span`
    color: ${props => props.theme.componentsTheme.textInputTextColor};
    font-size: 14px;
    font-weight: normal;
    line-height: 21px;
    text-align: right;
`;

const BigInputNumberTokenLabel = (props: { tokenSymbol: string }) => (
	<TokenContainer>
		<TokenText>{tokenSymbolToDisplayString(props.tokenSymbol)}</TokenText>
	</TokenContainer>
);

let BuySell = (props: Props) => {
	let [state, _setState] = React.useState<State>({
		makerAmount: null,
		price: null,
		orderType: OrderType.Market,
		tab: OrderSide.Buy,
		error: {
			btnMsg: null,
			cardMsg: null,
		},
	});
	let setState = (partialState: Partial<State>) => _setState(Object.assign({}, state, partialState));

	let {showAlert} = useAlertDialog();

	React.useEffect(() => {
		const newProps = props;
		if (newProps.orderPriceSelected !== props.orderPriceSelected && state.orderType === OrderType.Limit) {
			setState({
				price: newProps.orderPriceSelected,
			});
		}
	}, [props]);

	React.useEffect(() => {
		if (state.error.cardMsg) {
			showAlert(state.error.cardMsg);
		}
	}, [state.error]);

	const { currencyPair, web3State } = props;
	const { makerAmount, price, tab, orderType, error } = state;

	let changeTab = (tab: OrderSide) => () => setState({ tab });

	let updateMakerAmount = (newValue: BigNumber) => setState({makerAmount: newValue});

	let updatePrice = (price: BigNumber) => setState({ price });

	let submit = async () => {
		const orderSide = state.tab;
		const makerAmount = state.makerAmount || ZERO;
		const price = state.price || ZERO;
		//const orderFeeData = await props.onFetchTakerAndMakerFee(makerAmount, price, state.tab);
		try {
			if (state.orderType === OrderType.Limit) {
				await limitOrderCoinToMesh();
				props.toggleTriggerOrderSubmitted();
				//await props.onSubmitLimitOrder(makerAmount, price, orderSide, orderFeeData);
			} else {
				await fillLimitOrder(makerAmount);
				//await props.onSubmitMarketOrder(makerAmount, orderSide, orderFeeData);
			}
		} catch (error) {
			setState({
				error: {
					btnMsg: 'Error',
					cardMsg: error.message,
				},
			});
		}
		
		_reset();
	};

	let _reset = () => {
		setState({
			makerAmount: new BigNumber(0),
			price: new BigNumber(0),
		});
	};

	let _switchToMarket = () => {
		setState({
			orderType: OrderType.Market,
		});
	};

	let _switchToLimit = () => {
		setState({
			orderType: OrderType.Limit,
		});
	};

	const buySellInnerTabs = [
		{
			active: orderType === OrderType.Market,
			onClick: _switchToMarket,
			text: 'Market',
		},
		{
			active: orderType === OrderType.Limit,
			onClick: _switchToLimit,
			text: 'Limit',
		},
	];

	const isMakerAmountEmpty = makerAmount === null || makerAmount.isZero();
	const isPriceEmpty = price === null || price.isZero();

	const orderTypeLimitIsEmpty = orderType === OrderType.Limit && (isMakerAmountEmpty || isPriceEmpty);
	const orderTypeMarketIsEmpty = orderType === OrderType.Market && isMakerAmountEmpty;

	const btnPrefix = tab === OrderSide.Buy ? 'Buy ' : 'Sell ';
	const btnText = error && error.btnMsg ? 'Error' : btnPrefix + tokenSymbolToDisplayString(currencyPair.base);

	const decimals = getKnownTokens().getTokenBySymbol(currencyPair.base).decimals;

	let {
		account, 
		quoteAsset, setQuoteAsset, 
		baseAsset, setBaseAsset, 
		quoteAssetBalance, setQuoteAssetBalance,
		baseAssetBalance, setBaseAssetBalance, 
		quoteAssetAllowance, setQuoteAssetAllowance,
		baseAssetAllowance, setBaseAssetAllowance, 
		limitTradeBaseAmount, setLimitBuyBaseAmount, 
		quoteUnitPrice, setQuoteUnitPrice,
		quoteTotalPrice, setQuoteTotalPrice, 
		isLimitBuyMode, setLimitBuyMode,
		toggleLimitBuyMode,
		takerFillableOrders,
		totalFillablePrice,
		totalFillableBaseAmount,
		takerTokenFeeAmount,
		setAllowance,
		limitOrderCoinToMesh,
		formatAssetDecimal,
		fillLimitOrder,
	} = props.buySellHook;
	let {isUnlocked} = props;
	let isBalanceSufficient = (
		isLimitBuyMode ?
		(
			orderType === OrderType.Limit ?
			props.quoteTokenBalance && props.quoteTokenBalance.balance.comparedTo(quoteTotalPrice) != -1 :
			props.quoteTokenBalance && props.quoteTokenBalance.balance.comparedTo(totalFillablePrice) != -1
		) :
		(props.baseTokenBalance && props.baseTokenBalance.balance.comparedTo(limitTradeBaseAmount) != -1)
	);
	
	React.useEffect(() => {
		if (tab === OrderSide.Buy) {
			setLimitBuyMode(true);
		} else if (tab === OrderSide.Sell) {
			setLimitBuyMode(false);
		}
	}, [tab]);

	React.useEffect(() => {
		if (makerAmount) {
			setLimitBuyBaseAmount(makerAmount);
		}
	}, [makerAmount]);

	// makerAmount => limitBuyBaseAmount,totalFillableBaseAmount
	React.useEffect(() => {
		if (orderType === OrderType.Market) {
			if (makerAmount && baseAsset && quoteAsset) {
				let multiplier = new BigNumber(1);
				if (isLimitBuyMode) {
					multiplier = getMultipler(baseAsset.decimal, quoteAsset.decimal);
				}
				let totalFillableAmount = totalFillableBaseAmount.multipliedBy(multiplier);
				if (makerAmount.isGreaterThan(totalFillableAmount)) {
					setState({makerAmount: totalFillableAmount});
				}
			}
		}
	}, [totalFillableBaseAmount]);

	React.useEffect(() => {
		if (price) {
			setQuoteUnitPrice(price);
		}
	}, [price]);

	let totalCost = (
		orderType === OrderType.Limit ?
		quoteAsset ? formatAssetDecimal(quoteTotalPrice, quoteAsset, 6) : new BigNumber(0) :
		quoteAsset && baseAsset ? formatAssetDecimal(totalFillablePrice, isLimitBuyMode ? quoteAsset : baseAsset, 6) : new BigNumber(0)
	);

	return (
		<>
			<BuySellWrapper>
				<TabsContainer>
					<TabButton
						isSelected={tab === OrderSide.Buy}
						onClick={changeTab(OrderSide.Buy)}
						side={OrderSide.Buy}
					>
						Buy
					</TabButton>
					<TabButton
						isSelected={tab === OrderSide.Sell}
						onClick={changeTab(OrderSide.Sell)}
						side={OrderSide.Sell}
					>
						Sell
					</TabButton>
				</TabsContainer>
				<Content>
					<LabelContainer>
						<Label>Amount</Label>
						<InnerTabs tabs={buySellInnerTabs} />
					</LabelContainer>
					<FieldContainer>
						<BigInputNumberStyled
							decimals={decimals}
							min={ZERO}
							onChange={updateMakerAmount}
							value={makerAmount}
							
						/>
						<BigInputNumberTokenLabel tokenSymbol={currencyPair.base} />
					</FieldContainer>
					{orderType === OrderType.Limit && (
						<>
							<LabelContainer>
								<Label>Price per token</Label>
							</LabelContainer>
							<FieldContainer>
								<BigInputNumberStyled
									decimals={0}
									min={ZERO}
									onChange={updatePrice}
									value={price}
									placeholder={'0.00'}
								/>
								<BigInputNumberTokenLabel tokenSymbol={currencyPair.quote} />
							</FieldContainer>
						</>
					)}
					<OrderDetailsContainer
						orderType={orderType}
						orderSide={tab}
						tokenAmount={makerAmount || ZERO}
						tokenPrice={price || ZERO}
						currencyPair={currencyPair}
						takerTokenFeeAmount={
							orderType === OrderType.Market ? (
								isLimitBuyMode ? (
									quoteAsset ? formatAssetDecimal(takerTokenFeeAmount, quoteAsset, 6) : new BigNumber(0)
								) : (
									baseAsset ? formatAssetDecimal(takerTokenFeeAmount, baseAsset, 6) : new BigNumber(0)
								)
							) : new BigNumber(0)
						}
						totalCost={totalCost}
					/>
					<Button
						disabled={
							(web3State !== Web3State.Done || orderTypeLimitIsEmpty || orderTypeMarketIsEmpty) || 
							!isBalanceSufficient || 
							(orderType === OrderType.Market && takerFillableOrders.length == 0) ||
							!isUnlocked
						}
						icon={error && error.btnMsg ? ButtonIcons.Warning : undefined}
						onClick={submit}
						variant={
							error && error.btnMsg
								? ButtonVariant.Error
								: tab === OrderSide.Buy
									? ButtonVariant.Buy
									: ButtonVariant.Sell
						}
					>
						{
							(orderType === OrderType.Market && takerFillableOrders.length == 0) ? 
							'no matching orders' : 
							!isUnlocked ?
							'need to unlock both assets' :
							!isBalanceSufficient ? 
							'insufficient balance' :
							btnText
						}
					</Button>
				</Content>
			</BuySellWrapper>
			{error && error.cardMsg ? (
				<ErrorCard fontSize={FontSize.Large} text={error.cardMsg} icon={ErrorIcons.Sad} />
			) : null}
		</>
	);
};

const mapStateToProps = (state: StoreState): StateProps => {
	return {
		web3State: getWeb3State(state),
		currencyPair: getCurrencyPair(state),
		orderPriceSelected: getOrderPriceSelected(state),
		baseTokenBalance: getBaseTokenBalance(state),
		quoteTokenBalance: getQuoteTokenBalance(state),
	};
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
	return {
		onConnectWallet: () => dispatch(initWallet()),
	};
};

const BuySellContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(BuySell);

export { BuySell, BuySellContainer };
