import * as T from '../types';
declare let numberComparer: () => T.Comparer<number>;
declare type NumberComparer = typeof numberComparer;
declare let defaultComparer: <T>() => T.Comparer<T>;
declare type DefaultComparer = typeof defaultComparer;
declare let jsonComparer: (comparer?: T.Comparer<any>) => T.Comparer<T.Record<string, any>>;
declare type JsonComparer = typeof jsonComparer;
declare namespace JsonComparer {
    let deepify: (jsonComparer: (comparer?: T.Comparer<any>) => T.Comparer<T.Record<string, any>>) => (comparer?: T.Comparer<any>) => T.Comparer<T.Record<string, any>>;
    type Deepify = typeof deepify;
}
declare let arrayComparer: <T>(comparer?: T.Comparer<T>) => T.Comparer<T[]>;
declare type ArrayComparer = typeof arrayComparer;
export { numberComparer, NumberComparer, defaultComparer, DefaultComparer, jsonComparer, JsonComparer, arrayComparer, ArrayComparer };
