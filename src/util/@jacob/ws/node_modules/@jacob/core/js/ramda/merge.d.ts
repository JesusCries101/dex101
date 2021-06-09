import { String, Record } from '../toolbelt';
declare namespace Merge {
    interface ResolveKeyClash {
        (k: String, l: any, r: any): any;
    }
}
declare let merge: (resolveKeyClash: Merge.ResolveKeyClash) => (l: Record<string, any>, r: Record<string, any>) => Record<string, any>;
declare type Merge = typeof merge;
export default merge;
export { merge, Merge };
