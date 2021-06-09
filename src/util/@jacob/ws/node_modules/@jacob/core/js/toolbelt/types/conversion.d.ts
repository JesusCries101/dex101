import { TupleHead, TupleTail, TupleLength, TuplePrepend } from './tuple';
import { UnionDecrement, UnionPop } from './set';
declare type TupleToUnion<TArray extends any[], TAcc = never> = {
    0: TupleToUnion<TupleTail<TArray>, TAcc | TupleHead<TArray>>;
    1: TAcc;
}[TupleLength<TArray> extends 0 ? 1 : 0];
declare type UnionToTuple<TUnion, TAcc extends any[] = []> = {
    0: UnionToTuple<UnionDecrement<TUnion>, TuplePrepend<TAcc, UnionPop<TUnion>>>;
    1: TAcc;
}[[TUnion] extends [never] ? 1 : 0];
export { TupleToUnion, UnionToTuple };
