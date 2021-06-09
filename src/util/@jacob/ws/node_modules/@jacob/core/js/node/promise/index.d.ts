import { Boolean, Thunk, Predicate } from '../../toolbelt';
import * as T from '../../toolbelt';
declare let waitUntil: (pred: Predicate<true>) => T.Promise<void>;
declare type WaitUntil = typeof waitUntil;
declare let waitFor: (ms: number) => T.Promise<void>;
declare type WaitFor = typeof waitFor;
declare let loopify: (pred: Predicate<true>) => (thunk: Thunk<any, true>) => T.Promise<void>;
declare type Loopify = typeof loopify;
declare let statefulLoopify: <TState>(_: TState) => (pred: StatefulLoopify.Predicate<TState, true>) => (thunk: StatefulLoopify.Thunk<TState, any, true>) => T.Promise<void>;
declare type StatefulLoopify = typeof statefulLoopify;
declare namespace StatefulLoopify {
    interface Predicate<TState, async extends Boolean = false> {
        (_: TState): T.Predicate<async>;
    }
    interface Thunk<TState, T, async extends Boolean = false> {
        (_: TState): T.Thunk<T, async>;
    }
}
export { waitUntil, WaitUntil, waitFor, WaitFor, loopify, Loopify, statefulLoopify, StatefulLoopify };
