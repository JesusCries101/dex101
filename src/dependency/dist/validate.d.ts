import { Denull } from './common';
export interface Validator<T = any> {
    (val: any): val is T;
}
export declare type Validators = {
    [K in string]: Validators | Validator;
};
export declare type _Validate<TValidators> = (TValidators extends Function ? TValidators extends Validator<infer T> ? T : never : TValidators extends any[] ? {
    [I in keyof TValidators]: _Validate<TValidators[I]>;
} : {
    [K in keyof TValidators]: _Validate<TValidators[K]>;
});
export declare type Validate<TValidators> = _Validate<TValidators>;
export declare let validate: <TValidators>(validators: TValidators) => (val: any) => _Validate<TValidators>;
export declare let undefinedifyValidator: <TValidator extends Validator<any>>(validator: TValidator) => TValidator extends Validator<infer T> ? Validator<T | undefined> : never;
export declare let nullifyValidator: <TValidator extends Validator<any>>(validator: TValidator) => TValidator extends Validator<infer T> ? Validator<T | null> : never;
export declare let denullifyValidator: <TValidator extends Validator<any>>(validator: TValidator) => TValidator extends Validator<infer T> ? Validator<Denull<T>> : never;
export declare type Boolean = boolean;
export declare namespace Boolean {
    let Validator: Validator<boolean>;
}
export declare type String = string;
export declare namespace String {
    let Validator: Validator<string>;
}
export declare type Number = number;
export declare namespace Number {
    let Validator: Validator<number>;
}
export declare type Int = number;
export declare namespace Int {
    let Validator: Validator<number>;
}
export declare type SNumber = string;
export declare namespace SNumber {
    let Validator: Validator<string>;
}
export declare type Array<T extends any = any> = T[];
export declare namespace Array {
    let Validator: Validator<Array<any>>;
}
export declare type Json = Record<any, any>;
export declare namespace Json {
    let Validator: Validator<Record<any, any>>;
}
export interface Function<TArgs extends any[] = any[], TRet extends any = any> {
    (args: TArgs): TRet;
}
export declare namespace Function {
    let Validator: Validator<Function<any[], any>>;
}
export declare namespace Disjunction {
    let Validator: <T>(...vals: T[]) => Validator<T>;
}
