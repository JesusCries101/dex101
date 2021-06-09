export declare class PromiseCapability<T extends any> {
    resolve: (value?: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
    promise: Promise<T>;
    constructor();
}
export default PromiseCapability;
