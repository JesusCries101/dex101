import * as T from '../toolbelt';
declare let trampoline: <TArgs extends any[], TRet>(fn: Trampoline.Recurrence<TArgs, TRet>) => T.Function<TArgs, TRet>;
declare type Trampoline = typeof trampoline;
declare namespace Trampoline {
    type Recurrence<TArgs extends any[], TRet> = T.Function<TArgs, State<T.Required<TArgs>, TRet>>;
    type State<TArgs extends any[], TRet> = Bounce<TArgs> | Crack<TRet>;
    interface Crack<TRet> {
        recur: false;
        ret: TRet;
    }
    interface Bounce<TArgs extends any[]> {
        recur: true;
        args: TArgs;
    }
    interface Combiner<TRet> {
        (...rets: TRet[]): TRet;
    }
    let bounce: <TArgs extends any[]>(...args: TArgs) => Bounce<TArgs>;
    let crack: <TRet>(ret: TRet) => Crack<TRet>;
    let isCrack: <TArgs extends any[], TRet>(state: State<TArgs, TRet>) => state is Crack<TRet>;
    let isBounce: <TArgs extends any[], TRet>(state: State<TArgs, TRet>) => state is Bounce<TArgs>;
    let combine: <TArgs extends any[], TRet>(states_0: State<TArgs, TRet>, states_1: State<TArgs, TRet>) => (combiner: Combiner<TRet>) => State<TArgs, TRet>;
}
export default trampoline;
export { trampoline, Trampoline };
