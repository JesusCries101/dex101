import Hex from './hex';
declare type Bytes20 = Hex & {
    _type1: 'bytes20';
};
declare namespace Bytes20 {
    let isType: (val: any) => val is Bytes20;
    let create: (val: string) => string & {
        _type0: "hex";
    } & {
        _type1: "bytes20";
    };
    let toBytes32: (bytes20: Bytes20) => Bytes32;
}
declare type Bytes32 = Hex & {
    _type1: 'bytes32';
};
declare namespace Bytes32 {
    let isType: (val: any) => val is Bytes32;
    let create: (val: string) => string & {
        _type0: "hex";
    } & {
        _type1: "bytes32";
    };
    let toBytes20: (bytes32: Bytes32) => Bytes20;
}
export { Bytes20, Bytes32 };
