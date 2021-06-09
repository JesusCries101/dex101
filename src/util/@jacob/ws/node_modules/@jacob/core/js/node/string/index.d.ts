import * as T from '../../toolbelt';
declare let replace: (config: Replace.Config) => (str: string) => string;
declare type Replace = typeof replace;
declare namespace Replace {
    interface Config {
        once: T.Boolean;
        replacers: T.Record<T.String, T.String>;
    }
}
export { replace, Replace };
