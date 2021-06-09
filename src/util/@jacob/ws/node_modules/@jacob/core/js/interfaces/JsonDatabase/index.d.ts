import * as T from '../../toolbelt';
import * as _bridge from './bridge';
interface JsonDatabase<TNode extends T.Object, TKey extends T.String = T.String> {
    getTree: () => T.Promisable<JsonDatabase.Tree<TNode, TKey>>;
    getByKey: (key: TKey) => T.Promisable<TNode[]>;
    setByKey: (node: TNode) => (key: TKey) => T.Promisable<void>;
    removeByKey: (node: TNode) => (key: TKey) => T.Promisable<void>;
    getKey: (node: TNode) => T.Promisable<TKey>;
}
declare namespace JsonDatabase {
    type Tree<TNode extends T.Object, TKey extends T.String = T.String> = T.Record<TKey, TNode[]>;
    let push: <TNode extends T.Object, TKey extends string>(db: JsonDatabase<TNode, TKey>) => (node: TNode) => T.Promise<void>;
    type Push = typeof push;
    let remove: <TNode extends T.Object, TKey extends string>(db: JsonDatabase<TNode, TKey>) => (node: TNode) => T.Promise<void>;
    type Remove = typeof remove;
    let getByKey: <TNode extends T.Object, TKey extends string>(db: JsonDatabase<TNode, TKey>) => (key: TKey) => T.Promise<TNode[]>;
    export import bridge = _bridge;
}
export default JsonDatabase;
export { JsonDatabase };
