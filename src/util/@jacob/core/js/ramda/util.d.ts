import * as T from '../toolbelt';
import isNaN = globalThis.isNaN;
declare let isNil: (arg: any) => arg is null | undefined;
declare let isNumber: (arg: any) => arg is number;
declare let isArray: (arg: any) => arg is any[];
declare let isJson: (arg: any) => arg is T.Record<string | number | symbol, any>;
declare let isString: (arg: any) => arg is string;
declare let then: <T0, T1>(onSuccess: T.Function<[T0], T.Promisable<T1>>) => (promise: T.Promise<T0>) => T.Promise<T1>;
declare let min: (arg: number, ...args: number[]) => number;
declare let max: (arg: number, ...args: number[]) => number;
declare let and: (arg: boolean, ...args: boolean[]) => boolean;
declare let or: (arg: boolean, ...args: boolean[]) => boolean;
export { isNaN, isNil, isNumber, isArray, isJson, isString, then, min, max, and, or };
