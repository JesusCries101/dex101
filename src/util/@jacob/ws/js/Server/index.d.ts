import { toolbelt as T } from '@jacob/core';
import * as Websocket from 'isomorphic-ws';
import * as Ws from '../common';
declare class Server<TPayloadByType extends Ws.PayloadByType> {
    _: Server._<TPayloadByType>;
    constructor(config: Server.Config.Optional<TPayloadByType>);
    start(): T.Promise<this>;
}
declare namespace Server {
    interface _<TPayloadByType extends Ws.PayloadByType> {
        config: Config<TPayloadByType>;
        wss: Websocket.Server;
    }
    interface Config<TPayloadByType extends Ws.PayloadByType> {
        port: T.Number;
        dataToReqAction(data: Ws.Data): T.Promisable<Ws.ReqAction<TPayloadByType>>;
        reqActionToResAction(reqAction: Ws.ReqAction<TPayloadByType>): T.Promisable<Ws.ResAction<TPayloadByType>>;
        resActionToData(resAction: Ws.ResAction<TPayloadByType>): T.Promisable<Ws.Data>;
    }
    namespace Config {
        type Optional<TPayloadByType extends Ws.PayloadByType> = T.Json<T.PickPartial<Config<TPayloadByType>, never>>;
        type Preloaded<TPayloadByType extends Ws.PayloadByType> = T.Required<T.FilterPartial<Optional<TPayloadByType>>>;
    }
    export import Common = Ws;
}
export default Server;
export { Server };
