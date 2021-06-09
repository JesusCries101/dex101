import { BigNumber, NULL_BYTES } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { ZERO } from '../../../common/constants';
import { getKnownTokens } from '../../../util/known_tokens';
import { buildMarketOrders, sumTakerAssetFillableOrders } from '../../../util/orders';
import { tokenAmountInUnits, tokenSymbolToDisplayString } from '../../../util/tokens';
import { CurrencyPair, OrderFeeData, OrderSide, OrderType, StoreState, UIOrder } from '../../../util/types';

let feePercentage = (
	((feePercentage = process.env.REACT_APP_FEE_PERCENTAGE) => (
		feePercentage ? new BigNumber(feePercentage).div(new BigNumber(1e2)) : new BigNumber(0)
	))()
);

const Row = styled.div`
    align-items: center;
    border-top: dashed 1px ${props => props.theme.componentsTheme.borderColor};
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    position: relative;
    z-index: 1;

    &:last-of-type {
        margin-bottom: 20px;
    }
`;

const Value = styled.div`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    flex-shrink: 0;
    font-feature-settings: 'tnum' 1;
    font-size: 14px;
    line-height: 1.2;
    white-space: nowrap;
`;

const CostValue = styled(Value)`
    font-feature-settings: 'tnum' 1;
    font-weight: bold;
`;

const LabelContainer = styled.div`
    align-items: flex-end;
    display: flex;
    justify-content: space-between;
    margin: 5px 0 10px 0;
`;

const Label = styled.label<{ color?: string }>`
    color: ${props => props.color || props.theme.componentsTheme.textColorCommon};
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    margin: 0;
`;

const MainLabel = styled(Label)``;

const FeeLabel = styled(Label)`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-weight: normal;
`;

const CostLabel = styled(Label)`
    font-weight: 700;
`;

interface OwnProps {
    orderType: OrderType;
    tokenAmount: BigNumber;
    tokenPrice: BigNumber;
    orderSide: OrderSide;
    currencyPair: CurrencyPair;
    totalCost?: BigNumber;
    takerTokenFeeAmount?: BigNumber;
}

interface StateProps {}

interface DispatchProps {}

type Props = StateProps & OwnProps & DispatchProps;

interface State {
    makerFeeAmount: BigNumber;
    takerFeeAmount: BigNumber;
    makerFeeAssetData?: string;
    takerFeeAssetData?: string;
    canOrderBeFilled?: boolean;
    quoteTokenAmount: BigNumber;
}

class OrderDetails extends React.Component<Props, State> {
    public state = {
        makerFeeAmount: ZERO,
        takerFeeAmount: ZERO,
        makerFeeAssetData: NULL_BYTES,
        takerFeeAssetData: NULL_BYTES,
        quoteTokenAmount: ZERO,
        canOrderBeFilled: true,
    };

    public componentDidUpdate = async (prevProps: Readonly<Props>) => {
        const newProps = this.props;
        if (
            newProps.tokenPrice !== prevProps.tokenPrice ||
            newProps.orderType !== prevProps.orderType ||
            newProps.tokenAmount !== prevProps.tokenAmount ||
            newProps.currencyPair !== prevProps.currencyPair ||
            newProps.orderSide !== prevProps.orderSide
        ) {
            await this._updateOrderDetailsState();
        }
    };

    public componentDidMount = async () => {
        await this._updateOrderDetailsState();
    };

    public render = () => {
        const fee = this._getFeeStringForRender();
        const cost = this._getCostStringForRender();
        const { orderSide } = this.props;
        const costText = orderSide === OrderSide.Sell ? 'Total' : 'Cost';
        return (
            <>
                <LabelContainer>
                    <MainLabel>Order Details</MainLabel>
                </LabelContainer>
                <Row>
                    <FeeLabel>Fee</FeeLabel>
                    <Value>{fee}</Value>
                </Row>
                <Row>
                    <CostLabel>{costText}</CostLabel>
                    <CostValue>{cost}</CostValue>
                </Row>
            </>
        );
    };

    private readonly _updateOrderDetailsState = async () => {
    };

    private readonly _getFeeStringForRender = () => {
        const { quote, base } = this.props.currencyPair;
        let feeAmount = (
            this.props.orderSide === OrderSide.Sell ?
            (this.props.totalCost || new BigNumber(0)).multipliedBy(feePercentage) :
            new BigNumber(0)
        );
        if (this.props.orderType === OrderType.Market && this.props.takerTokenFeeAmount) {
            feeAmount = this.props.takerTokenFeeAmount;
        }
        let tokenSymbol = (
            this.props.orderType === OrderType.Market ? (
                this.props.orderSide === OrderSide.Sell ?
                tokenSymbolToDisplayString(base) :
                tokenSymbolToDisplayString(quote)
            ) : (
                this.props.orderSide === OrderSide.Sell ?
                tokenSymbolToDisplayString(quote) :
                tokenSymbolToDisplayString(base)
            )
        );
        return `${feeAmount} ${tokenSymbol}`;
    };

    private readonly _getCostStringForRender = () => {
        const { quote } = this.props.currencyPair;
        const quoteToken = getKnownTokens().getTokenBySymbol(quote);
        const { quoteTokenAmount } = this.state;
        const costAmount = this.props.totalCost || tokenAmountInUnits(quoteTokenAmount, quoteToken.decimals, quoteToken.displayDecimals);
        return `${costAmount} ${tokenSymbolToDisplayString(quote)}`;
    };
}

const mapStateToProps = (state: StoreState): StateProps => ({});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({});

const OrderDetailsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(OrderDetails);

export { CostValue, OrderDetails, OrderDetailsContainer, Value };
