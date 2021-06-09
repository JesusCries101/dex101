import ThunkQueue from './ThunkQueue';
import * as T from '../toolbelt';
declare let memoizedQueuefy: (config: MemoizedQueuefy.Config) => <T>(thunk: T.Thunk<T, true>) => T.Thunk<T.Promise<T>, false>;
declare type MemoizedQueuefy = typeof memoizedQueuefy;
declare namespace MemoizedQueuefy {
    interface Config {
        config: ThunkQueue.OptionalConfig;
        onExecution: (api: T.Pick<ThunkQueue, 'getConfig' | 'setConfig'>) => T.Promisable<void>;
    }
}
export { memoizedQueuefy, MemoizedQueuefy };
