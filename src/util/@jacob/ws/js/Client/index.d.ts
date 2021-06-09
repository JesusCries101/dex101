import { toolbelt as T, async as A } from '@jacob/core';
import * as Websocket from 'isomorphic-ws';
import * as Ws from '../common';
declare class Client<TPayloadByType extends Ws.PayloadByType> {
    _: Client._<TPayloadByType>;
    constructor(config: Client.Config.Optional<TPayloadByType>);
    start(): T.Promise<this>;
    makeAction<TType extends keyof TPayloadByType>(type: TType, payload: TPayloadByType[TType]['req']): Ws.Action<TType, TPayloadByType[TType]['req']>;
    dispatch<TType extends keyof TPayloadByType>(action: Ws.Action<TType, TPayloadByType[TType]['req']>): T.Promise<Ws.Action<TType, T.Nullable<TPayloadByType[TType]['res']>>>;
    kill(): void;
}
declare namespace Client {
    interface _<TPayloadByType extends Ws.PayloadByType> {
        config: Config<TPayloadByType>;
        ws: Websocket;
        resPayloadByType: {
            [K in keyof TPayloadByType]: T.Nullable<TPayloadByType[K]['res']>;
        };
        fgStarted: T.Boolean;
        queuefy: T.ReturnType<A.MemoizedQueuefy>;
    }
    interface Config<TPayloadByType extends Ws.PayloadByType> {
        address: T.String | import('url').URL;
        reqActionToData(action: Ws.ReqAction<TPayloadByType>): T.Promisable<Ws.Data>;
        dataToResAction(data: Ws.Data): T.Promisable<Ws.ResAction<TPayloadByType>>;
    }
    namespace Config {
        type Optional<TPayloadByType extends Ws.PayloadByType> = T.Json<T.PickPartial<Config<TPayloadByType>, never>>;
        type Preloaded<TPayloadByType extends Ws.PayloadByType> = T.Required<T.FilterPartial<TPayloadByType>>;
    }
    export import Common = Ws;
}
export default Client;
export { Client };
