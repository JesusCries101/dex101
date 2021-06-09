import React from 'react'
import {
    DefaultThunkAction
} from '../../util/types'
import { deprecated } from 'typesafe-actions';
import {TradeHistoryEntry, PaginatedEntries, makePaginatedEntries} from '../../util/types'
let {createAction} = deprecated;

let headers = {
	'Content-Type': 'application/json',
	'auth-token': 'admin@gmail.com:password'
};

export let setTradeHistory = createAction('api/TRADE-HISTORY_set', resolve => {
    return (paginatedTrades: PaginatedEntries<TradeHistoryEntry>) => resolve(paginatedTrades);
});

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace _GetTradeHistory {
    export interface Conf {
        makerAsset: string;
        takerAsset: string;
        limit: number;
        offset: number;
    }
}
// deprecated
export let _getTradeHistory = (conf: _GetTradeHistory.Conf): DefaultThunkAction => (dispatch, getState) => (
    ((query) => (
        new Promise<any>((resolve, reject) => {
            (function getTradeHistory() {
                fetch(`/api/v1/admin/trades/paginated/?${query}`, {
                    method: 'GET',
                    headers,
                })
                    .then(res => (
                        res.json()
                            .then(res => {
                                if (typeof res.err === 'string') {
                                    reject(new Error(res.err));
                                } else {
                                    Promise.resolve<PaginatedEntries<TradeHistoryEntry>>(res)
                                        .then(setTradeHistory)
                                        .then(dispatch)
                                        .then(resolve);
                                }
                            })
                            .catch(() => new Promise(r => setTimeout(r, 1e3)).then(getTradeHistory))
                    ))
                    .catch(reject)
            })()
        })
            .catch(() => {})
    ))(
        [
            `makerAsset=Equal("${conf.makerAsset}")`,
            `takerAsset=Equal("${conf.takerAsset}")`,
            `entryLimit=${conf.limit}`,
            `entryOffset=${conf.offset}`,
            `orderDESC=${'settleAt'}`
        ].join('&')
    )
);
// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace GetTradeHistory {
    export interface Conf {
        asset0: string;
        asset1: string;
        limit: number;
        offset: number;
    }
}
export let getTradeHistory = (conf: GetTradeHistory.Conf): DefaultThunkAction => (dispatch, getState) => (
    ((query) => (
        new Promise<any>((resolve, reject) => {
            (function getTradeHistory() {
                fetch(`/api/v1/admin/trades/assetPair/?${query}`, {
                    method: 'GET',
                    headers,
                })
                    .then(res => (
                        res.json()
                            .then(res => {
                                if (typeof res.err === 'string') {
                                    reject(new Error(res.err));
                                } else {
                                    Promise.resolve<PaginatedEntries<TradeHistoryEntry>>(res)
                                        .then(setTradeHistory)
                                        .then(dispatch)
                                        .then(resolve);
                                }
                            })
                            .catch(() => new Promise(r => setTimeout(r, 1e3)).then(getTradeHistory))
                    ))
                    .catch(reject)
            })()
        })
            .catch(() => {})
    ))(
        [
            `asset0=${conf.asset0}`,
            `asset1=${conf.asset1}`,
            `entryLimit=${conf.limit}`,
            `entryOffset=${conf.offset}`,
            `orderDESC=${'settleAt'}`
        ].join('&')
    )
);