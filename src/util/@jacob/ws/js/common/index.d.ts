import { toolbelt as T } from '@jacob/core';
export interface Action<TType extends Action.Type, TPayload extends Action.Payload> {
    type: TType;
    payload: TPayload;
}
export declare namespace Action {
    type Type = T.Key;
    type Payload = any;
}
export interface Payload<TReq extends Action.Payload = Action.Payload, TRes extends Action.Payload = Action.Payload> {
    req: TReq;
    res: TRes;
}
export declare type PayloadByType = T.Record<Action.Type, Payload>;
export declare type Data = T.String;
export declare type ResAction<TPayloadByType extends PayloadByType> = ({
    [K in keyof TPayloadByType]: Action<K, TPayloadByType[K]['res']>;
}[keyof TPayloadByType]);
export declare type ReqAction<TPayloadByType extends PayloadByType> = ({
    [K in keyof TPayloadByType]: Action<K, TPayloadByType[K]['req']>;
}[keyof TPayloadByType]);
