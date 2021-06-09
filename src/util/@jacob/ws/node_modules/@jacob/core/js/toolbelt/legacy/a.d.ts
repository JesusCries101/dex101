export declare type Prepend<Tuple extends any[], Addend> = ((_: Addend, ..._1: Tuple) => any) extends ((..._: infer Result) => any) ? Result : never;
export declare type Reverse<Tuple extends any[], Prefix extends any[] = []> = {
    0: Prefix;
    1: ((..._: Tuple) => any) extends ((_: infer First, ..._1: infer Next) => any) ? Reverse<Next, Prepend<Prefix, First>> : never;
}[Tuple extends [any, ...any[]] ? 1 : 0];
