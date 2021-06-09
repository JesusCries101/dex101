import React from 'react';

//import { CheckMetamaskStateModalContainer } from '../../common/check_metamask_state_modal_container';
import { ColumnNarrow } from '../../common/column_narrow';
import { ColumnWide } from '../../common/column_wide';
import { Content } from '../common/content_wrapper';
import { BuySellContainer } from '../marketplace/BuySell';
import { OrderBookTableContainer } from '../marketplace/OrderBook';
import { OrderHistoryContainer } from '../marketplace/OrderHistory';
import { WalletBalanceContainer } from '../marketplace/WalletBalance';
import TradeRecordContainer from '../marketplace/TradeRecord';
import {DexChart} from '../../dex-chart'
import {connect} from 'react-redux'
import { StoreState, UIOrderV4 } from '../../../util/types';
import {
    getCurrencyPair
} from '../../../store/selectors'
import {useOrderBook, getUIOrderZeroX} from '../../../hook/SortedOrderBook' 
import {useLimitBuySell} from '../../../hook/LimitBuySell'
import {useMetaMask} from 'metamask-react'
import {useZeroX} from '../../../hook/ZeroX'
import {useAssetUnlock} from '../../../hook/AssetUnlock'
import {getTokenName, getERC20Token} from '../../../hook/erc20Token'
import {BigNumber} from '0x.js'

let mapStateToProps = (state: StoreState) => ({
    currencyPair: getCurrencyPair(state),
});
type StateProps = ReturnType<typeof mapStateToProps>;

type Props = StateProps & {};
let Marketplace = (
    (Marketplace => (
        connect(mapStateToProps)(Marketplace)
    ))(
        (props: Props) => {
            let [triggerOrderSubmitted, setTriggerOrderSubmitted] = React.useState(false);
            let toggleTriggerOrderSubmitted = () => setTriggerOrderSubmitted(!triggerOrderSubmitted);
            let orderBookHook = useOrderBook(getTokenName(props.currencyPair.base), getTokenName(props.currencyPair.quote));
            let buySellHook = useLimitBuySell(getTokenName(props.currencyPair.base), getTokenName(props.currencyPair.quote), orderBookHook);
            let {account} = useMetaMask();
            let [orders, setOrders] = React.useState<UIOrderV4[]>([]);
            let {zerox} = useZeroX();
            let {getAllowance} = useAssetUnlock();
            let [getAllowance_, setGetAllowance_] = React.useState<((assetName: string) => Promise<BigNumber>) | null>(null);
            let [isAssetBaseUnlocked, setIsAssetBaseUnlocked] = React.useState(false);
            let [isAssetQuoteUnlocked, setIsAssetQuoteUnlocked] = React.useState(false);
            
            React.useEffect(() => {
                if (account) {
                    setOrders(getUIOrderZeroX(orderBookHook.orderBook, account, zerox));
                }
            }, [account, orderBookHook.orderBook, zerox]);

            React.useEffect(() => {
                orderBookHook.updateOrderBook();
            }, [triggerOrderSubmitted]);

            React.useEffect(() => {
                orderBookHook.updateOrderBook(props.currencyPair.base, props.currencyPair.quote);
                buySellHook.updateCurrencyPair(props.currencyPair.base, props.currencyPair.quote);
            }, [props.currencyPair]);

            React.useEffect(() => {
                if (getAllowance) {
                    ((getAllowance) => {
                        setGetAllowance_(() => (assetName: string) => {
                            let token = getERC20Token(getTokenName(assetName));
                            if (token) {
                                return getAllowance(token);
                            } else {
                                return Promise.reject(new Error('token not supported'));
                            }
                        })
                    })(getAllowance)
                }
            }, [getAllowance]);

            React.useEffect(() => {
                if (getAllowance_) {
                    (getAllowance_ => (
                        Promise.all([
                            getAllowance_(props.currencyPair.base),
                            getAllowance_(props.currencyPair.quote),
                        ])
                            .then(([allowanceBase, allowanceQuote]) => {
                                if (allowanceBase.comparedTo(new BigNumber(0)) != 0) {
                                    setIsAssetBaseUnlocked(true);
                                } else {
                                    setIsAssetBaseUnlocked(false);
                                }
                                if (allowanceQuote.comparedTo(new BigNumber(0)) != 0) {
                                    setIsAssetQuoteUnlocked(true);
                                } else {
                                    setIsAssetQuoteUnlocked(false);
                                }
                            })
                    ))(getAllowance_)
                }
            }, [getAllowance_, props.currencyPair]);

            return (
                <Content>
                    <ColumnNarrow>
                        <OrderBookTableContainer {...{triggerOrderSubmitted, orderBookHook}} />
                    </ColumnNarrow>
                    <ColumnWide>
                        <div style={{marginBottom: '10px', borderRadius:'4px', border: '1px solid #dedede', padding: '1px'}}>
                            <DexChart currencyPair={props.currencyPair} isCurrencyPairLocked={true} />
                        </div>
                        <OrderHistoryContainer {...{orders, orderBookHook}} />
                        <TradeRecordContainer />
                    </ColumnWide>
                    <ColumnNarrow>
                        <WalletBalanceContainer {...{isAssetBaseUnlocked, isAssetQuoteUnlocked}} />
                        <BuySellContainer {...{orderBookHook, buySellHook, toggleTriggerOrderSubmitted, isUnlocked: isAssetBaseUnlocked && isAssetQuoteUnlocked}} />
                    </ColumnNarrow>
                    {/**<CheckMetamaskStateModalContainer /> */}
                </Content>
            );
        }
    )
);
export { Marketplace }
export default Marketplace