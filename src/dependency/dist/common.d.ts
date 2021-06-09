export declare let S: <T extends string>(_: T) => T;
export declare let T: <T extends any[]>(..._: T) => T;
export declare let N: <T extends number>(_: T) => T;
export declare let getFromJson: (...keys: string[]) => (json: any) => any;
export declare let pickJson: <TJson extends object, TKey extends keyof TJson, TRet extends { [K in TKey]: TJson[K]; }>(json: TJson, ...keys: TKey[]) => TRet;
export declare let omitJson: <TJson extends object, TKey extends keyof TJson, TRet extends (keyof TJson extends infer K ? K extends TKey ? never : K : never) extends infer K_1 ? { [S in K_1 extends keyof TJson ? K_1 : never]: TJson[S]; } : never>(json: TJson, ...keys: TKey[]) => TRet;
export declare let keysJson: <TJson extends object>(json: TJson) => (keyof TJson)[];
export declare let mapJson: <TJson extends object, TMapped extends unknown, TRet extends { [K in keyof TJson]: TMapped; }>(json: TJson, f: (k: keyof TJson, v: TJson[keyof TJson]) => TMapped) => TRet;
export declare let invertJson: <TJson>(json: TJson) => UnionToIntersection<{ [K in keyof TJson]: { [J in Cast<TJson[K], string>]: K; }; }[keyof TJson]> extends infer TJson_1 ? { [K_1 in keyof TJson_1]: TJson_1[K_1]; } : never;
export declare let tr: <T>(_: T) => <U>(f: (_: T) => U) => U;
export declare let eq: (a: any) => (b: any) => boolean;
export declare type UnionToIntersection<TUnion> = ((TUnion extends any ? (arg: TUnion) => void : never) extends ((arg: infer TIntersection) => void) ? TIntersection : never);
export declare type Denull<T> = T extends null ? never : T;
export declare type Cast<T, U> = T extends U ? T : U;
declare global {
    interface Array<T> {
        flatMap<U extends any>(fmap: (val: T, index: number, array: T[]) => U[]): U[];
    }
}
