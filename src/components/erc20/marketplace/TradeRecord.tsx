import { OrderStatus } from '@0x/types';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { UI_DECIMALS_DISPLAYED_PRICE_ETH } from '../../../common/constants';
import { getBaseToken, getQuoteToken, getWeb3State } from '../../../store/selectors';
import { tokenAmountInUnits } from '../../../util/tokens';
import { OrderSide, StoreState, Token, UIOrder, Web3State } from '../../../util/types';
import { Card } from '../../common/card';
import { EmptyContent } from '../../common/empty_content';
import { LoadingWrapper } from '../../common/loading';
import { CustomTD, Table, TH, THead, TR } from '../../common/table';
import {TradeTable} from '../../common/TradeTable'

interface StateProps {
  baseToken: Token | null;
  quoteToken: Token | null;
  web3State?: Web3State;
}

type Props = StateProps;

class TradeRecord extends React.Component<Props> {
  public render = () => {
    const { baseToken, quoteToken, web3State } = this.props;

    let content: React.ReactNode;
    switch (web3State) {
      case Web3State.Locked:
      case Web3State.NotInstalled:
      case Web3State.Loading: {
        content = <EmptyContent alignAbsoluteCenter={true} text="There are no trades to show" />;
        break;
      }
      default: {
        if (web3State !== Web3State.Error && (!baseToken || !quoteToken)) {
          content = <LoadingWrapper minHeight="120px" />;
        } else if (!baseToken || !quoteToken) {
          content = <EmptyContent alignAbsoluteCenter={true} text="There are no trades to show" />;
        } else {
          content = (
            <TradeTable />
          );
        }
        break;
      }
    }

    return <Card title="Trades">{content}</Card>;
  };
}
const mapStateToProps = (state: StoreState): StateProps => {
  return {
    baseToken: getBaseToken(state),
    quoteToken: getQuoteToken(state),
    web3State: getWeb3State(state),
  };
};
const TradeRecordContainer = connect(mapStateToProps)(TradeRecord);
export default TradeRecordContainer;
export { TradeRecord, TradeRecordContainer };