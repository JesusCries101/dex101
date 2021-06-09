import { Number } from './primitive';
import { Tuple, TupleConcat, TupleLength, TupleDrop } from './tuple';
import { Cast } from './util';
declare type Add<TThis extends Number, TAddend extends Number> = (TupleLength<TupleConcat<Tuple<null, TThis extends infer TInf ? Cast<TInf, Number> : never> extends infer TInf ? Cast<TInf, any[]> : never, Tuple<null, TAddend extends infer TInf ? Cast<TInf, Number> : never> extends infer TInf ? Cast<TInf, any[]> : never> extends infer TInf ? Cast<TInf, any[]> : never>);
declare type Increment<TThis extends Number> = (Add<TThis, 1>);
declare type Subtract<TThis extends Number, TSubtrahend extends Number> = (TupleLength<TupleDrop<Tuple<null, TThis extends infer TInf ? Cast<TInf, Number> : never> extends infer TInf ? Cast<TInf, any[]> : never, TSubtrahend> extends infer TInf ? Cast<TInf, any[]> : never>);
declare type Decrement<TThis extends Number> = (Subtract<TThis, 1>);
declare namespace Range {
    type _<TMin extends Number, TMax extends Number, TAcc extends Number = never> = {
        0: _<Increment<TMin>, TMax, TAcc | TMin>;
        1: TAcc;
    }[TMin extends TMax ? 1 : 0];
}
declare type Range<TMin extends Number, TMax extends Number> = Range._<TMin, Increment<TMax>>;
export { Add, Increment, Subtract, Decrement, Range };
