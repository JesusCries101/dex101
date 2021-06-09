import * as M from './Mixin';
import * as T from '../toolbelt';
export declare enum Ordering {
    LT = 0,
    EQ = 1,
    GT = 2
}
export declare const OrdFn: <TBase_1 extends T.Constructor<{
    equal(another: any): boolean;
    notEqual(another: any): boolean;
    initialize<TBase extends M.Base>(props?: T.Partial<TBase> | undefined): void;
} & M.Base>>(base: TBase_1) => {
    new (...args: any[]): {
        lessOrEqual(another: any): boolean;
        compare(another: any): Ordering;
        equal(another: any): boolean;
        notEqual(another: any): boolean;
        initialize<TBase_2 extends M.Base>(props?: T.Partial<TBase_2> | undefined): void;
    };
} & TBase_1;
export declare type Ord = M.Mixin<typeof OrdFn>;
