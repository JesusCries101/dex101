import { Cast } from './util';
declare type SetDiff<TSet, TSubset> = TSet extends TSubset ? never : TSet;
declare type SetComplement<TSet, TSubset extends TSet> = SetDiff<TSet, TSubset>;
declare type Complement<TSet, TSubset extends TSet> = SetComplement<TSet, TSubset>;
declare type UnionToIntersection<TUnion> = ((TUnion extends any ? (arg: TUnion) => any : never) extends ((arg: infer TIntersection) => any) ? TIntersection : never);
declare type UnionToOverloads<TUnion> = UnionToIntersection<TUnion extends any ? (arg: TUnion) => void : never>;
declare type UnionPop<TUnion> = UnionToOverloads<TUnion> extends ((arg: infer TPopped) => void) ? TPopped : never;
declare type UnionDecrement<TUnion> = Complement<TUnion, Cast<UnionPop<TUnion>, TUnion>>;
export { SetDiff, SetComplement, Complement, UnionToIntersection, UnionToOverloads, UnionPop, UnionDecrement };
