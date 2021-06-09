import Mutex from './Mutex';
import * as T from '../toolbelt';
declare class ThunkQueue {
    _: ThunkQueue._;
    constructor(config: ThunkQueue.OptionalConfig);
    getConfig(): ThunkQueue.Config;
    setConfig(config: T.Partial<ThunkQueue.Config>): void;
    push(thunk?: T.Thunk<any, true>): Promise<void>;
    run(): Promise<void>;
    next(): Promise<void>;
}
declare namespace ThunkQueue {
    interface _ {
        config: Config;
        queueTask: AsyncTask[];
        mutex: Mutex;
        fgRun: Boolean;
    }
    interface Config {
        maxConcurrency: T.Number;
        delay: T.Number;
        onDelay: (config: T.Pick<Config, 'delay' | 'maxConcurrency'>) => any;
    }
    type OptionalConfig = T.Json<T.PickPartial<Config, 'onDelay'>>;
    type PreloadedConfig = T.Required<T.FilterPartial<OptionalConfig>>;
    interface AsyncTask {
        thunk: T.Thunk<void, true>;
        resolve: T.Function;
        reject: T.Function;
    }
}
export default ThunkQueue;
export { ThunkQueue };
