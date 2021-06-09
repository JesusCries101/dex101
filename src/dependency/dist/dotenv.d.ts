import { Validator } from './validate';
export declare let get: <T = string>(key: string, filter?: (val: string) => T) => T;
export declare let get_: <TValidators extends Record<string, Validator<any>>>(validators: TValidators) => <T = string>(key: string, filter?: (val: string) => T) => T;
