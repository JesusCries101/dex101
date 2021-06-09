export type Detypify<TMap extends Record<string, any>> = {
  [K in keyof TMap]: any;
};
export type SetDifference<A, B> = A extends B ? never : A;
export type SetComplement<A, A1 extends A> = SetDifference<A, A1>;
export let btoa = (
  (str: string): string => (
    Buffer.from(str).toString('base64')
  )
);
export type UnionToIntersection<TUnion> = (
  (
    TUnion extends any ? (arg: TUnion) => void : never
  ) extends (
    (arg: infer TIntersection) => void
  ) ? 
  TIntersection : 
  never
);