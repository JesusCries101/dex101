import React from 'react';
import Link from '@material-ui/core/Link';
import {
  withStyles,
  WithStyles,
  createStyles,
  Theme
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import {
  toolbelt as T,
  ramda as R,
  util as U,
  node as N
} from '../../../util/@jacob/core';
import fetch from 'cross-fetch';
import CircularProgress from '@material-ui/core/CircularProgress';

// Generate Order Data
function createData(
  id: number, 
  date: string, 
  name: string, 
  shipTo: string, 
  paymentMethod: string, 
  amount: string
) {
  return { id, date, name, shipTo, paymentMethod, amount };
}
/*
const rows = [
  createData(0, '16 Mar, 2019', '0x36628b5355229c572154539e1e56444ac413d37a972675c6d905f8e0303e33d1', '5 BKR', '5 USDT', 1.00),
  createData(1, '16 Mar, 2019', '0x85cfdb39d8d92421e927aa67303f8bd4d8b565ad6bb01062de2cee7a89a396a2', '4 BKR', '4 USDT', 1.00),
  createData(2, '16 Mar, 2019', '0xe837667863ceb204bed36b524531b543865b7b6e30611622e99ef039af90b7df', '4 BKR', '4 USDT', 1.00),
  createData(3, '16 Mar, 2019', '0x154b47d251ff15214f18e9c2a3190b357323d76358ca35538827da4c4419c6c4', '5 BKR', '5 BAT', 1.00),
  createData(3, '16 Mar, 2019', '0x154b47d251ff15214f18e9c2a3190b357323d76358ca35538827da4c4419c6c4', '5 BKR', '5 BAT', 1.00),
];
*/

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

class Trades extends React.Component<Trades.Props, Trades.State> {
  constructor(props) {
    super(props);
    this.state = {
      arrayTrade: [],
      fgFetchingTrades: true
    };
  }
  componentDidMount() {
    let p = this;
    return (
      T.Promise.resolve({
        addressAsset: '0xc4777287ddceb283ed6db59c88db5074f1b25e4e',
        makerAssetAmount: undefined as unknown as T.Number,
        takerAssetAmount: undefined as unknown as T.Number,
      })
        .then(_ => (
          U.util.errorloopify({
            async: true,
            thunk: () => (
              fetch('https://cryptosx-initiate.herokuapp.com/?url=https://jacob-blockscout.herokuapp.com/trades', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  ...T.json.pick(_, 'addressAsset')
                })
              })
            ),
            onRetry: () => N.promise.waitFor(10e3)
          })
            .then(res => (
              R.isNil(res) ?
              undefined as void : (
                T.Promise.resolve()
                  .then(() => res.json())
                  .then(json => json as Trades.Record[])
                  .then(arrayTrade => (
                    p.setState({
                      arrayTrade: (
                        arrayTrade
                          .filter(trade => (
                            R.isNil(p.props.instrument) || (
                              p.props.instrument
                                .map(addressAsset => addressAsset.toLowerCase())
                                .every(addressAsset => (
                                  [trade.parsedData.makerAssetAddress, trade.parsedData.takerAssetAddress]
                                    .map(e => e.toLowerCase())
                                    .some(e => e === addressAsset)
                                ))
                            )
                          ))
                          .map((trade, i) => (
                            _.makerAssetAmount = Math.round(trade.parsedData.makerAssetFilledAmount * Math.pow(10, -1 * trade.parsedData.makerAssetDecimals)),
                            _.takerAssetAmount = Math.round(trade.parsedData.takerAssetFilledAmount * Math.pow(10, -1 * trade.parsedData.takerAssetDecimals)),
                            createData(
                              i, 
                              trade.date, 
                              trade.transactionHash,
                              `${_.makerAssetAmount} ${trade.parsedData.makerAssetSymbol || 'TOKEN'}`,
                              `${_.takerAssetAmount} ${trade.parsedData.takerAssetSymbol || 'TOKEN'}`, (
                                (amount => (
                                  amount
                                ))(
                                  {
                                    [trade.parsedData.makerAssetAddress.toLowerCase()]: () => `${Math.round(_.makerAssetAmount / _.takerAssetAmount)} ${trade.parsedData.takerAssetSymbol}`,
                                    [trade.parsedData.takerAssetAddress.toLowerCase()]: () => `${Math.round(_.takerAssetAmount / _.makerAssetAmount)} ${trade.parsedData.makerAssetSymbol}`
                                  }[_.addressAsset.toLowerCase()]()
                                )
                              )
                            )
                          ))
                      ),
                      fgFetchingTrades: false
                    })
                  ))
              )
            ))
        ))
    );
  }
  render() {
    let { classes, title } = this.props;
    return (
      <React.Fragment>
        <Title>{title || ''}</Title>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tx1}>Date</TableCell>
              <TableCell className={classes.tx2}>Txn Hash</TableCell>
              <TableCell align="right" className={classes.tx3}>Maker</TableCell>
              <TableCell align="right" className={classes.tx4}>Taker</TableCell>
              <TableCell align="right" className={classes.tx5}>Price</TableCell>
            </TableRow>
          </TableHead>
          {this.state.fgFetchingTrades ? (
            <CircularProgress size={24} />
          ) : (
            <TableBody>
            {this.state.arrayTrade.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell align="right">{row.shipTo}</TableCell>
                <TableCell align="right">{row.paymentMethod}</TableCell>
                <TableCell align="right">{row.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          )}
        </Table>
        {/**
         * <div className={classes.seeMore}>
          <Link color="primary" href="#" onClick={(event: React.MouseEvent) => event.preventDefault()}>
            See more trades
          </Link>
        </div>
         */}
      </React.Fragment>
    );
  }
}
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Trades {
  export interface State {
    arrayTrade: (T.ReturnType<typeof createData>)[];
    fgFetchingTrades: T.Boolean;
  }
  export interface Props extends WithStyles<typeof styles> {
    title?: T.String;
    instrument?: [T.String, T.String];
  }
  export interface Record {
    transactionHash: T.String;
    blockNumber: T.Number;
    addressAsset: T.String;
    parsedData: {
      makerAddress: T.String;
      takerAddress: T.String;
      makerAssetFilledAmount: T.Number;
      takerAssetFilledAmount: T.Number;
      makerAssetData: T.String;
      takerAssetData: T.String;
      makerAssetAddress: T.String;
      takerAssetAddress: T.String;
      makerAssetSymbol: T.String;
      takerAssetSymbol: T.String;
      makerAssetDecimals: T.Number;
      takerAssetDecimals: T.Number;
    };
    timestamp: T.String;
    date: T.String;
  }
}
export default withStyles(styles)(Trades);