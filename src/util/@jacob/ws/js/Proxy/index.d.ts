import { toolbelt as T } from '@jacob/core';
import * as Websocket from 'isomorphic-ws';
declare class Proxy {
    _: Proxy._;
    constructor(config: Proxy.Config.Optional);
    start(): T.Promise<this>;
}
declare namespace Proxy {
    interface _ {
        config: Config;
        id: T.Number;
        channelById: Map<this['id'], Channel>;
        wss: Websocket.Server;
    }
    interface Config {
        address: T.String | import('url').URL;
        port: T.Number;
    }
    namespace Config {
        type Optional = T.Json<T.PickPartial<Config, never>>;
        type Preloaded = T.Required<T.FilterPartial<Optional>>;
    }
    interface Channel {
        wsClient: Websocket;
        wsServer: Websocket;
    }
}
export default Proxy;
export { Proxy };
