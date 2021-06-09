import JsonDatabase from './';
import * as T from '../../toolbelt';
declare namespace JsonBlob {
    let makeBridge: (config: T.Json<T.PickPartial<MakeBridge.Config, never>>) => <TNode extends T.Object>(_: T.Pick<JsonDatabase<TNode, string>, "getKey">) => JsonDatabase<TNode, string>;
    type MakeBridge = typeof makeBridge;
    namespace MakeBridge {
        interface Config {
            blobpath: T.String;
        }
        namespace Config {
            type Optional = T.Json<T.PickPartial<Config, never>>;
        }
    }
}
export { JsonBlob };
