import * as Websocket from 'isomorphic-ws';
declare namespace WebsocketClient {
    interface Config<TActionType extends string, TMapActionType2ReqPayload extends Record<TActionType, Record<string, any>>, TMapActionType2ResPayload extends Record<TActionType, Record<string, any>>> {
        address: string | import('url').URL;
        makeAction(type: TActionType, payload: TMapActionType2ReqPayload[TActionType], ...typeDeducers: [TMapActionType2ReqPayload?]): Action<TActionType, TMapActionType2ReqPayload[TActionType]>;
        actionReducer(action: Action<TActionType, TMapActionType2ReqPayload[TActionType]>): Data;
        messageDigester(msg: Data, ...typeDeducers: [TMapActionType2ResPayload?]): Partial<{
            type: TActionType;
            payload: TMapActionType2ResPayload[TActionType];
        }>;
    }
    interface Action<TType extends string = string, TPayload extends Record<string, any> = Record<string, any>> {
        type: TType;
        payload: TPayload;
    }
    type Data = string;
}
declare class WebsocketClient<TActionType extends string = string, TMapActionType2ReqPayload extends Record<TActionType, Record<string, any>> = Record<TActionType, Record<string, any>>, TMapActionType2ResPayload extends Record<TActionType, Record<string, any>> = Record<TActionType, Record<string, any>>> {
    config: WebsocketClient.Config<TActionType, TMapActionType2ReqPayload, TMapActionType2ResPayload>;
    ws: Websocket | null;
    mapType2ResPayload: TMapActionType2ResPayload;
    constructor(config: WebsocketClient.Config<TActionType, TMapActionType2ReqPayload, TMapActionType2ResPayload>);
    start(): Promise<this>;
    kill(): void;
    dispatch<T extends TActionType>(type: T, payload: TMapActionType2ReqPayload[T]): Promise<{
        type: T;
        payload: TMapActionType2ResPayload[T];
    }>;
}
export default WebsocketClient;
export { WebsocketClient };
