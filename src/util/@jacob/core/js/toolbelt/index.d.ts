export * from './types';
export * from './util';
import * as T from './types';
declare let pickJson: <TJson extends T.Record<string | number | symbol, any>, TKey extends keyof TJson>(json: TJson, ...keys: TKey[]) => T.Pick<TJson, TKey>;
declare type PickJson = typeof pickJson;
declare let arrayifyJson: <TJson extends T.Record<string | number | symbol, any>, TMapped>(json: TJson, mapper: ArrayifyJson.Mapper<TJson, TMapped>) => TMapped[];
declare type ArrayifyJson = typeof arrayifyJson;
declare namespace ArrayifyJson {
    interface Mapper<TJson extends T.Record, TMapped> {
        (key: keyof TJson, json: TJson, i: T.Number, n: T.Number): TMapped;
    }
}
declare let monoTuple: <T, N extends number>(val: T, length: N) => {
    0: {
        0: {
            0: {
                0: {
                    0: {
                        0: {
                            0: {
                                0: {
                                    0: {
                                        0: {
                                            0: any[11 extends N ? 1 : 0];
                                            1: [T, T, T, T, T, T, T, T, T, T];
                                        }[10 extends N ? 1 : 0];
                                        1: [T, T, T, T, T, T, T, T, T];
                                    }[9 extends N ? 1 : 0];
                                    1: [T, T, T, T, T, T, T, T];
                                }[8 extends N ? 1 : 0];
                                1: [T, T, T, T, T, T, T];
                            }[7 extends N ? 1 : 0];
                            1: [T, T, T, T, T, T];
                        }[6 extends N ? 1 : 0];
                        1: [T, T, T, T, T];
                    }[5 extends N ? 1 : 0];
                    1: [T, T, T, T];
                }[4 extends N ? 1 : 0];
                1: [T, T, T];
            }[3 extends N ? 1 : 0];
            1: [T, T];
        }[2 extends N ? 1 : 0];
        1: [T];
    }[1 extends N ? 1 : 0];
    1: [];
}[0 extends N ? 1 : 0];
declare type MonoTuple = typeof monoTuple;
declare let nullifyError: <T>(thunk: T.Thunk<T, false>) => T.Thunk<T.Nullable<T>, false>;
declare type NullifyError = typeof nullifyError;
declare let initJson: <TJson extends T.Record<string | number | symbol, any>, TKey extends keyof TJson>(json: TJson, key: TKey) => (defVal: TJson[TKey]) => TJson[TKey];
declare type InitJson = typeof initJson;
declare let replace: <T>(arg: T) => (comparer?: T.Comparer<T>) => (from: T, to: T) => T;
declare type Replace = typeof replace;
declare let mapJson: <TJson extends T.Record<string | number | symbol, any>, TMapped>(json: TJson, mapper: ArrayifyJson.Mapper<TJson, TMapped>) => { [K in keyof TJson]: TMapped; };
declare type MapJson = typeof mapJson;
declare namespace MapJson {
    export import Mapper = ArrayifyJson.Mapper;
}
declare let removeJson: <TJson extends T.Record<string | number | symbol, any>, TKey extends keyof TJson>(json: TJson, ...keys: TKey[]) => { [K in T.SetDiff<keyof TJson, TKey>]: TJson[K]; };
declare type RemoveJson = typeof removeJson;
declare let leafifyJson: (<TJson extends T.Record<string | number | symbol, any>, TLeafNode>(json: TJson, isLeafNode?: ((val: any) => val is TLeafNode) | undefined) => unknown extends TLeafNode ? {
    0: TJson extends T.Record<any, infer TInf> ? {
        0: TInf extends T.Record<any, infer TInf> ? any[TInf extends TInf ? 0 : 1] : TInf;
        1: never;
    }[TInf extends TInf ? 0 : 1] : TJson;
    1: never;
}[TJson extends TJson ? 0 : 1][] : TLeafNode[]) & {
    trampolined: null;
};
declare type LeafifyJson = typeof leafifyJson;
declare namespace json {
    let pick: <TJson extends T.Record<string | number | symbol, any>, TKey extends keyof TJson>(json: TJson, ...keys: TKey[]) => T.Pick<TJson, TKey>;
    let arrayify: <TJson extends T.Record<string | number | symbol, any>, TMapped>(json: TJson, mapper: ArrayifyJson.Mapper<TJson, TMapped>) => TMapped[];
    let map: <TJson extends T.Record<string | number | symbol, any>, TMapped>(json: TJson, mapper: ArrayifyJson.Mapper<TJson, TMapped>) => { [K in keyof TJson]: TMapped; };
    let init: <TJson extends T.Record<string | number | symbol, any>, TKey extends keyof TJson>(json: TJson, key: TKey) => (defVal: TJson[TKey]) => TJson[TKey];
    let remove: <TJson extends T.Record<string | number | symbol, any>, TKey extends keyof TJson>(json: TJson, ...keys: TKey[]) => { [K in T.SetDiff<keyof TJson, TKey>]: TJson[K]; };
    let leafify: (<TJson extends T.Record<string | number | symbol, any>, TLeafNode>(json: TJson, isLeafNode?: ((val: any) => val is TLeafNode) | undefined) => unknown extends TLeafNode ? {
        0: TJson extends T.Record<any, infer TInf> ? {
            0: TInf extends T.Record<any, infer TInf> ? any[TInf extends TInf ? 0 : 1] : TInf;
            1: never;
        }[TInf extends TInf ? 0 : 1] : TJson;
        1: never;
    }[TJson extends TJson ? 0 : 1][] : TLeafNode[]) & {
        trampolined: null;
    };
    let length: <TJson extends T.Record<string | number | symbol, any>>(json: TJson) => number;
    let fullLeafify: <TJson extends T.Record<string | number | symbol, any>, TLeaf>(json: TJson, isLeaf?: ((val: any) => val is TLeaf) | undefined) => unknown extends TLeaf ? FullLeafify.Leaf<{
        0: TJson extends T.Record<any, infer TInf> ? {
            0: TInf extends T.Record<any, infer TInf> ? any[TInf extends TInf ? 0 : 1] : TInf;
            1: never;
        }[TInf extends TInf ? 0 : 1] : TJson;
        1: never;
    }[TJson extends TJson ? 0 : 1]>[] : FullLeafify.Leaf<TLeaf>[];
    namespace FullLeafify {
        interface Leaf<TLeaf> {
            val: TLeaf;
            keys: T.String[];
        }
    }
    let copy: <TJson extends T.Record<string | number | symbol, any>>(json: TJson) => TJson;
    type Copy = typeof copy;
    let unpromisify: <TPromisified extends T.Record<string, T.Promise<any>>>(promisified: TPromisified) => T.Promise<T.Json<{ [K in keyof TPromisified]: T.UnwrapPromise<TPromisified[K]>; }>>;
    type Unpromisify = typeof unpromisify;
}
declare namespace string {
    let create: <T extends string>(val: T) => T;
}
export { pickJson, PickJson, arrayifyJson, ArrayifyJson, monoTuple, MonoTuple, nullifyError, NullifyError, initJson, InitJson, replace, Replace, mapJson, MapJson, removeJson, RemoveJson, leafifyJson, LeafifyJson, json, string };
