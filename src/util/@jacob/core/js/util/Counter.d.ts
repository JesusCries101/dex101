import { Number, Boolean, MonoInterface, Required, PickPartial, FilterPartial, Json } from '../toolbelt';
declare class Counter {
    config: Counter.Config;
    _: Counter._;
    constructor(config: Counter.OptionalConfig);
    current(): Number;
    next(): Number;
    prev(): Number;
    index(): Number;
    advanceable(): Boolean;
    reversible(): Boolean;
    advance(): Boolean;
    reverse(): Boolean;
}
declare namespace Counter {
    type Config = MonoInterface<('init' | 'step' | 'lim' | 'rep'), Number>;
    type OptionalConfig = Json<PickPartial<Config, 'step' | 'rep'>>;
    type PreloadedConfig = Required<FilterPartial<OptionalConfig>>;
    interface _ {
        i: Number;
    }
}
export default Counter;
export { Counter };
