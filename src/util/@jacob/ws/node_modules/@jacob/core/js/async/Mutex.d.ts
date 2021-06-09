/// <reference types="node" />
import { EventEmitter } from 'events';
import * as T from '../toolbelt';
declare class Mutex {
    _: Mutex._;
    constructor(config: Mutex.OptionalConfig);
    acquire(): Promise<void>;
    release(): Promise<void>;
}
declare namespace Mutex {
    interface _ {
        emitter: EventEmitter;
        fgLocked: Boolean;
        config: Config;
    }
    interface Config {
        maxListeners: T.Number;
    }
    type OptionalConfig = T.Json<T.PickPartial<Config, 'maxListeners'>>;
    type PreloadedConfig = T.Required<T.FilterPartial<OptionalConfig>>;
}
export default Mutex;
export { Mutex };
