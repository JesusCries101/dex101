import * as T from '../toolbelt';
declare let loopify: <TAsync extends boolean, TRet>(config: T.Json<T.PickPartial<Loopify.Config<TAsync, TRet>, never>>) => TAsync extends true ? T.Promise<void> : void;
declare type Loopify = typeof loopify;
declare namespace Loopify {
    type Config<TAsync extends T.Boolean, TRet> = {
        async: TAsync;
        thunk: T.Thunk<(TAsync extends true ? TRet : (TRet extends T.Promise<any> ? never : TRet))>;
        pred: T.Thunk<(TAsync extends true ? T.Promisable<T.Boolean> : T.Boolean)>;
    };
    namespace Config {
        type Optional<TAsync extends T.Boolean, TRet> = T.Json<T.PickPartial<Config<TAsync, TRet>, never>>;
        type Preloaded<TAsync extends T.Boolean, TRet> = T.Required<T.FilterPartial<Optional<TAsync, TRet>>>;
    }
}
declare let errorloopify: <TAsync extends boolean, TRet>(config: T.Json<T.PickPartial<Errorloopify.Config<TAsync, TRet>, "onRetry">>) => TRet extends T.Promise<infer TInf> ? T.Promise<T.Nullable<TInf>> : T.Nullable<TRet>;
declare type Errorloopify = typeof errorloopify;
declare namespace Errorloopify {
    interface Config<TAsync extends T.Boolean, TRet> {
        async: TAsync;
        thunk: T.Thunk<(TAsync extends true ? TRet : (TRet extends T.Promise<any> ? never : TRet))>;
        nRetry?: T.Number;
        onRetry: (err: T.Error, i: T.Number, n?: T.Number) => (TAsync extends true ? T.Promisable<void> : void);
    }
    namespace Config {
        type Optional<TAsync extends T.Boolean, TRet> = T.Json<T.PickPartial<Config<TAsync, TRet>, 'onRetry'>>;
        type Preloaded<TAsync extends T.Boolean, TRet> = T.Required<T.FilterPartial<Optional<TAsync, TRet>>>;
    }
}
export { loopify, Loopify, errorloopify, Errorloopify };
