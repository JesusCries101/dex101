import { Validate, Validator } from './validate';
export declare let parse: <TValidators extends Record<string, Validator<any>>>(validators: TValidators) => import("./validate")._Validate<TValidators>;
