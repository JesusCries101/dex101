import { Cast } from './util';
declare type ArrayType<TArray extends any[]> = TArray extends (infer T)[] ? T : never;
declare type TupleLength<TTuple extends any[]> = TTuple['length'];
declare type TupleHeadTail<TTuple extends any[]> = (TupleLength<TTuple> extends 0 ? [undefined, []] : ((...args: TTuple) => any) extends ((head: infer THead, ...tail: infer TTail) => any) ? [THead, TTail] : never);
declare type TupleHead<TTuple extends any[]> = TupleHeadTail<TTuple>[0];
declare type TupleTail<TTuple extends any[]> = TupleHeadTail<TTuple>[1];
declare type TupleHasTail<TTuple extends any[]> = (TTuple extends ([] | [any]) ? false : true);
declare type TupleLast<TTuple extends any[]> = {
    0: TupleLast<TupleTail<TTuple>>;
    1: TupleHead<TTuple>;
}[TupleHasTail<TTuple> extends true ? 0 : 1];
declare type TuplePrepend<TTuple extends any[], THead> = (((head: THead, ...tail: TTuple) => any) extends ((...args: infer TCombined) => any) ? TCombined : never);
declare type TupleConcat<TTuple extends any[], TTail extends any[]> = (TupleReverse<(TupleReverse<TTuple> extends infer TInf ? Cast<TInf, any[]> : never), TTail>);
declare type TupleAppend<TTuple extends any[], TLast> = (TupleConcat<TTuple, [TLast]>);
declare type TupleDrop<TTuple extends any[], TLength extends Number, TAcc extends any[] = []> = {
    0: TupleDrop<TupleTail<TTuple>, TLength, TuplePrepend<TAcc, any>>;
    1: TTuple;
}[TupleLength<TAcc> extends TLength ? 1 : 0];
declare type TupleShift<TTuple extends any[]> = (TupleDrop<TTuple, 1>);
declare type TuplePop<TTuple extends any[]> = (TupleReverse<TupleShift<(TupleReverse<TTuple> extends infer TInf ? Cast<TInf, any[]> : never)>>);
declare type TupleReverse<TTuple extends any[], TAcc extends any[] = []> = {
    0: TupleReverse<TupleTail<TTuple>, TuplePrepend<TAcc, TupleHead<TTuple>>>;
    1: TAcc;
}[TupleLength<TTuple> extends 0 ? 1 : 0];
declare type Tuple<T, TLength extends Number, TAcc extends T[] = []> = {
    0: Tuple<T, TLength, TuplePrepend<TAcc, T>>;
    1: TAcc;
}[TupleLength<TAcc> extends TLength ? 1 : 0];
export { ArrayType, TupleLength, TupleHeadTail, TupleHead, TupleTail, TupleHasTail, TupleLast, TuplePrepend, TupleConcat, TupleAppend, TupleDrop, TupleShift, TuplePop, TupleReverse, Tuple };
