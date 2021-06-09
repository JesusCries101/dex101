/// <reference types="node" />
import { toolbelt as T } from '@jacob/core';
import * as Websocket from 'isomorphic-ws';
export declare type Address = T.String | import('url').URL;
export declare let createWebsocket: (address: string | import("url").URL) => T.Promise<Websocket>;
