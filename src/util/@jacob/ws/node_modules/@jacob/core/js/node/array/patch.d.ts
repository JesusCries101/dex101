import * as T from '../../toolbelt';
declare let uniquify: <T>(array: T[]) => () => T[];
declare type Uniquify = typeof uniquify;
declare let mutativeFilter: <T>(array: T[]) => <U extends T>(pred: MutativeFilter.Predicate<T, U>, thisArg?: any) => U[];
declare type MutativeFilter = typeof mutativeFilter;
declare namespace MutativeFilter {
    interface Predicate<T, U extends T> {
        (value: T, index?: T.Number, array?: T[]): value is U;
    }
    interface WeakPredicate<T> {
        (value: T, index?: T.Number, array?: T[]): boolean;
    }
}
declare let flexibleIndexOf: <T>(array: T[]) => (val: T, comparer: T.Comparer<T>) => number;
declare type FlexibleIndexOf = typeof flexibleIndexOf;
declare namespace string {
    let split: (config: Split.Config) => (str: string) => string[];
    type Split = typeof split;
    namespace Split {
        interface Config {
            trDelim: (delim: T.String) => T.String;
            once: T.Boolean;
            arrayDelim: T.String[];
        }
        interface Node {
            val: T.String;
            isDelim: T.Boolean;
        }
    }
}
export { uniquify, Uniquify, mutativeFilter, MutativeFilter, flexibleIndexOf, FlexibleIndexOf, string };
