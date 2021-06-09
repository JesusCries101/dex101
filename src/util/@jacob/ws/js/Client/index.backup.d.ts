import { toolbelt as T, async as A } from '@jacob/core';
import * as Websocket from 'isomorphic-ws';
declare class Client<TPayloadByType extends Client.PayloadByType> {
    _: Client._<TPayloadByType>;
    constructor(config: Client.Config.Optional<TPayloadByType>);
    start(): T.Promise<this>;
    makeAction<TType extends keyof TPayloadByType>(type: TType, payload: TPayloadByType[TType]['req']): Client.Action<TType, TPayloadByType[TType]['req']>;
    dispatch<TType extends keyof TPayloadByType>(action: Client.Action<TType, TPayloadByType[TType]['req']>): T.Promise<Client.Action<TType, T.Nullable<TPayloadByType[TType]['res']>>>;
    kill(): void;
}
declare namespace Client {
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
        reduceReqAction(action: Client.ReqAction<TPayloadByType>): Data;
        extractResAction(data: Data): T.Promisable<Client.ResAction<TPayloadByType>>;
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
export default Client;
export { Client };
