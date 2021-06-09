import { toolbelt as T, async as A } from '@jacob/core';
import * as Websocket from 'isomorphic-ws';
declare class WsClient<TPayloadByType extends WsClient.PayloadByType> {
    _: WsClient._<TPayloadByType>;
    constructor(config: WsClient.Config.Optional<TPayloadByType>);
    start(): T.Promise<this>;
    makeAction<TType extends keyof TPayloadByType>(type: TType, payload: TPayloadByType[TType]['req']): WsClient.Action<TType, TPayloadByType[TType]['req']>;
    dispatch<TType extends keyof TPayloadByType>(action: WsClient.Action<TType, TPayloadByType[TType]['req']>): T.Promise<WsClient.Action<TType, T.Nullable<TPayloadByType[TType]['res']>>>;
    kill(): void;
}
declare namespace WsClient {
    interface _<TPayloadByType extends PayloadByType> {
        config: Config<TPayloadByType>;
        ws: Websocket;
        resPayloadByType: {
            [K in keyof TPayloadByType]: T.Nullable<TPayloadByType[K]['res']>;
        };
        fgStarted: T.Boolean;
        queuefy: T.ReturnType<A.MemoizedQueuefy>;
    }
    interface Config<TPayloadByType extends PayloadByType> {
        address: T.String | import('url').URL;
        reduceReqAction(action: WsClient.ReqAction<TPayloadByType>): Data;
        extractResAction(data: Data): T.Promisable<WsClient.ResAction<TPayloadByType>>;
    }
    namespace Config {
        type Optional<TPayloadByType extends PayloadByType> = T.Json<T.PickPartial<Config<TPayloadByType>, never>>;
        type Preloaded<TPayloadByType extends PayloadByType> = T.Required<T.FilterPartial<TPayloadByType>>;
    }
    interface Action<TType extends Action.Type, TPayload extends Action.Payload> {
        type: TType;
        payload: TPayload;
    }
    namespace Action {
        type Type = T.Key;
        type Payload = any;
    }
    interface Payload<TReq extends Action.Payload = Action.Payload, TRes extends Action.Payload = Action.Payload> {
        req: TReq;
        res: TRes;
    }
    type PayloadByType = T.Record<Action.Type, Payload>;
    type Data = T.String;
    type ResAction<TPayloadByType extends PayloadByType> = ({
        [K in keyof TPayloadByType]: Action<K, TPayloadByType[K]['res']>;
    }[keyof TPayloadByType]);
    type ReqAction<TPayloadByType extends PayloadByType> = ({
        [K in keyof TPayloadByType]: Action<K, TPayloadByType[K]['req']>;
    }[keyof TPayloadByType]);
}
export default WsClient;
export { WsClient };
