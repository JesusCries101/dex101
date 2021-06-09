import * as T from '../toolbelt';
export declare class Base {
    initialize<TBase extends Base>(props?: T.Partial<TBase>): void;
    static new<TConstructor extends typeof Base>(this: TConstructor, props?: T.Partial<T.InstanceType<TConstructor>>): T.InstanceType<TConstructor>;
}
export declare type BaseConstructor = typeof Base;
export declare type Mixin<TFunc extends MixinFunction> = T.InstanceType<T.ReturnType<TFunc>>;
export declare type MixinConstructor<T extends T.Function> = (T extends T.Function<infer M> ? M extends T.Constructor<Base> ? M & BaseConstructor : M : T.ReturnType<T>);
export declare type MixinFunction = (base: T.Constructor) => T.Constructor;
