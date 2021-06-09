import React from 'react'
import { connect } from 'react-redux'
import { StoreState } from '../../util/types'
import { getTradeHistory } from '../../store/api/actions'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from '../profiles/hcs/Title';
import {
    withStyles,
    WithStyles,
    createStyles,
    Theme
} from '@material-ui/core/styles';
import {
    getCurrencyPair
} from '../../store/selectors'
import {TradeHistoryEntry} from '../../util/types'
import {DateWrapper} from '../../dependency/dist/DateWrapper'
import { Button } from '@material-ui/core';

const styles = (theme: Theme) =>
    createStyles({
        seeMore: {
            marginTop: theme.spacing(3),
        },
        tx1: {
            width: '20%',
        },
        tx2: {
            width: '20%',
        },
        tx3: {
            width: '20%',
        },
        tx4: {
            width: '20%',
        },
        tx5: {
            width: '20%',
        },
    });
type StylesProps = WithStyles<typeof styles>;

let mapStateToProps = (state: StoreState) => ({
    trades: state.api.trades,
    currencyPair: getCurrencyPair(state),
});
type StateProps = ReturnType<typeof mapStateToProps>;

let mapDispatchtoProps = (dispatch: Function) => ({
    getTradeHistory: (asset0: string, asset1: string, limit: number, offset: number) => (
        dispatch(getTradeHistory({ asset0, asset1, limit, offset }))
    ),
});
type DispatchProps = ReturnType<typeof mapDispatchtoProps>;

type Props = StylesProps & StateProps & DispatchProps & {
    title?: string;
};

let getPrice = (trade: TradeHistoryEntry) => (
    (parseFloat(trade.takerAmount) / parseFloat(trade.makerAmount)).toFixed(4)
);

const limit = 4;
const maxPage = 4;
const maxOffset = maxPage * limit;

export let TradeTable = (
    (TradeTable => (
        withStyles(styles)(connect(mapStateToProps, mapDispatchtoProps)(TradeTable))
    ))(
        (props: Props) => {
            let [offset, setOffset] = React.useState(0);
            let [isFetching, setIsFetching] = React.useState(false);
            let updateOffset = (offset: number) => {
                if (!(maxOffset < offset)) {
                    setOffset(offset);
                }
            };

            React.useEffect(() => {
                setOffset(0);
            }, [props.currencyPair]);

            React.useEffect(() => {
                setIsFetching(true);
                props.getTradeHistory(props.currencyPair.base.toUpperCase(), props.currencyPair.quote.toUpperCase(), limit, offset);
            }, [offset, props.currencyPair]);

            React.useEffect(() => {
                setIsFetching(false);
            }, [props.trades]);

            return (
                <React.Fragment>
                    <Title>{props.title || ''}</Title>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell className={props.classes.tx1}>Date</TableCell>
                                <TableCell className={props.classes.tx2}>Txn Hash</TableCell>
                                <TableCell align="right" className={props.classes.tx3}>Maker</TableCell>
                                <TableCell align="right" className={props.classes.tx4}>Taker</TableCell>
                                <TableCell align="right" className={props.classes.tx5}>Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{
                            props.trades.entries.map((row) => (
                                <TableRow key={row.txHash}>
                                    <TableCell>{new DateWrapper(new Date(row.settleAt * 1e3)).format()}</TableCell>
                                    <TableCell>{row.txHash}</TableCell>
                                    <TableCell align="right">{row.makerAddress}</TableCell>
                                    <TableCell align="right">{row.takerAddress}</TableCell>
                                    <TableCell align="right">{getPrice(row)}</TableCell>
                                </TableRow>
                            ))
                        }</TableBody>
                    </Table>
                    <Button disabled={isFetching} onClick={() => updateOffset(Math.max(offset - limit, 0))}>Prev</Button>
                    {`Page ${(offset / limit + 1).toFixed(0)}`}
                    <Button disabled={isFetching} onClick={() => updateOffset(offset + limit < props.trades.total ? offset + limit : offset)}>Next</Button>
                </React.Fragment>
            );
        }
    )
);
export default TradeTable