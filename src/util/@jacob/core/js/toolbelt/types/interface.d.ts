import * as T from '../../toolbelt';
interface Function<TArgs extends any[] = any[], TRet = any> {
    (...args: TArgs): TRet;
}
interface Thunk<T, async extends Boolean = false> {
    (): async extends false ? T : T | Promise<T>;
}
declare type Predicate<async extends Boolean = false> = Thunk<Boolean, async>;
interface Comparer<T> {
    (a: T, b: T): -1 | 0 | 1;
}
declare type Dictionary<TJson extends T.Record<T.String> = T.Record<T.String>> = TJson & {
    _type0: 'dictionary';
};
declare namespace Dictionary {
    type Wrap<TJson extends T.Record<T.String>> = TJson & {
        _type0: 'dictionary';
    };
    type Unwrap<TDictionary extends Dictionary> = (TDictionary extends infer TJson & {
        _type0: 'dictionary';
    } ? TJson : never);
    let isType: (val: any) => val is Dictionary<T.Record<string, any>>;
    let create: <TJson extends T.Record<string, any>>(json: TJson) => Dictionary<TJson>;
    let undo: <TDictionary extends Dictionary<T.Record<string, any>>>(dictionary: TDictionary) => TDictionary extends {
        _type0: "dictionary";
    } & infer TJson ? TJson : never;
}
declare type MonoDictionary = Dictionary | {
    [K in T.String]: MonoDictionary;
};
interface JsonTransform<TJson extends T.Record, TArgs extends any[], TRet extends T.Record> {
    (json: TJson, ...args: TArgs): TRet;
}
declare namespace JsonTransform {
    let deepify: <TJson extends T.Record<string | number | symbol, any>, TArgs extends any[], TRet extends T.Record<string | number | symbol, any>>(tr: JsonTransform<TJson, TArgs, TRet>) => JsonTransform<TJson, TArgs, TRet>;
    type Deepify = typeof deepify;
}
export { Function, Thunk, Predicate, Comparer, Dictionary, MonoDictionary, JsonTransform };
