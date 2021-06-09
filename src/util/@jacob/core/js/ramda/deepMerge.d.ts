import { String, Record } from '../toolbelt';
declare namespace DeepMerge {
    interface ResolveKeyClash {
        (k: String, l: any, r: any): any;
    }
}
declare let deepMerge: (resolveKeyClash: DeepMerge.ResolveKeyClash) => (l: Record<string, any>, r: Record<string, any>) => Record<string, any>;
declare type DeepMerge = typeof deepMerge;
export default deepMerge;
export { deepMerge, DeepMerge };
