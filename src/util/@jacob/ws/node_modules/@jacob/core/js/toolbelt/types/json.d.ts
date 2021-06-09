import { Key, String, Promise } from './primitive';
import { Complement } from './set';
import { Define, Nullable, NonNullable, Exclude, UnwrapPromise } from './util';
interface UnaryModifiers<T> {
    'partial': Partial<T>;
    'required': Required<T>;
    'define': JsonDefine<T>;
}
declare type Deep<T, TModifier extends keyof UnaryModifiers<T>> = (T extends Record ? TModifier extends 'partial' ? {
    [K in keyof T]?: Deep<T[K], TModifier>;
} : TModifier extends 'required' | 'define' ? {
    [K in keyof T]-?: Deep<T[K], TModifier>;
} : {
    [K in keyof T]: Deep<T[K], TModifier>;
} : UnaryModifiers<T>[TModifier]);
declare type MonoInterface<TKey extends String, TType> = {
    [K in TKey]: TType;
};
declare type Record<TKey extends Key = Key, TVal = any> = {
    [K in TKey]: TVal;
};
declare type Json<TJson extends Record> = {
    [K in keyof TJson]: TJson[K];
};
declare type Pick<TJson extends Record, TKey extends keyof TJson> = {
    [K in TKey]: TJson[K];
};
declare type Omit<TJson extends Record, TKey extends keyof TJson> = Pick<TJson, Exclude<keyof TJson, TKey>>;
declare type Partial<TJson extends Record> = {
    [K in keyof TJson]?: TJson[K];
};
declare type PickPartial<TJson extends Record, TKey extends keyof TJson> = (Partial<Pick<TJson, TKey>> & Pick<TJson, Complement<keyof TJson, TKey>>);
declare type Required<TJson extends Record> = {
    [K in keyof TJson]-?: TJson[K];
};
declare type Nullify<TJson extends Record> = {
    [K in keyof TJson]: Nullable<TJson[K]>;
};
declare type NonNullify<TJson extends Record> = {
    [K in keyof TJson]: NonNullable<TJson[K]>;
};
declare type Filter<TJson extends Record, TVal> = (Pick<TJson, {
    [K in keyof TJson]: TJson[K] extends TVal ? K : never;
}[keyof TJson]>);
declare type FilterPartial<TJson extends Record> = (Pick<TJson, {
    [K in keyof TJson]: undefined extends TJson[K] ? K : never;
}[keyof TJson]>);
declare type FindKeyByType<TJson extends Record<String>, TType> = ({
    [K in keyof TJson]: TJson[K] extends TType ? K : never;
}[keyof TJson]);
declare type JsonDefine<TJson extends Record> = {
    [K in keyof TJson]: Define<TJson[K]>;
};
declare type JsonLeafNode<TJson> = {
    0: TJson extends Record<any, infer TInf> ? JsonLeafNode<TInf> : TJson;
    1: never;
}[TJson extends TJson ? 0 : 1];
declare type Unpromisified<TJson extends Record<String, Promise<any>>> = Json<{
    [K in keyof TJson]: UnwrapPromise<TJson[K]>;
}>;
export { Deep, MonoInterface, Record, Json, Pick, Omit, Partial, PickPartial, Required, Nullify, NonNullify, Filter, FilterPartial, FindKeyByType, JsonDefine, JsonLeafNode, Unpromisified };
