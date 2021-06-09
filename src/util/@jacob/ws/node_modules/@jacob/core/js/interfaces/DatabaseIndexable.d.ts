import { Record, Key, Promisable } from '../toolbelt';
interface DatabaseIndexable<TNode extends Record, TNodeKey extends keyof TNode, TKey extends Key = Key> {
    getByKey(key: TKey): Promisable<TNode[]>;
    setByKey(key: TKey): (node: TNode) => Promisable<void>;
    keys: {
        [K in TNodeKey]-?: (node: TNode) => TKey;
    };
    combineKeys: (keys: this['keys']) => (node: TNode) => TKey;
}
declare namespace DatabaseIndexable {
    let query: <TNode extends Record<string | number | symbol, any>, TNodeKey extends keyof TNode>(indexable: DatabaseIndexable<TNode, TNodeKey, string | number | symbol>) => (node: TNode) => Promise<TNode[]>;
    let dispatch: <TNode extends Record<string | number | symbol, any>, TNodeKey extends keyof TNode>(indexable: DatabaseIndexable<TNode, TNodeKey, string | number | symbol>) => (node: TNode) => Promise<void>;
    type Query = typeof query;
}
export default DatabaseIndexable;
export { DatabaseIndexable, };
