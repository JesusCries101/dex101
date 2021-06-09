/// <reference types="node" />
import { EventEmitter } from 'events';
import * as T from '../../toolbelt';
declare let monkeypatch: (method: "once" | "addListener" | "on" | "removeListener" | "off" | "removeAllListeners" | "setMaxListeners" | "getMaxListeners" | "listeners" | "rawListeners" | "emit" | "listenerCount" | "prependListener" | "prependOnceListener" | "eventNames", cb: T.Function<any[], any>) => <TEmitter extends EventEmitter>(emitter: TEmitter) => TEmitter;
declare type Monkeypatch = typeof monkeypatch;
export { monkeypatch, Monkeypatch };
