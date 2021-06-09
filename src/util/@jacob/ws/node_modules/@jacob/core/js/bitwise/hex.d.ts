import * as T from '../toolbelt';
import Decimal from './decimal';
declare type Hex = T.String & {
    _type0: 'hex';
};
declare namespace Hex {
    let isType: (val: any) => val is Hex;
    let create: (str: string) => Hex;
    let pad: (dir: Pad.Direction, n: number) => (hex: Hex) => Hex;
    type Pad = typeof pad;
    namespace Pad {
        enum Direction {
            Left = 0,
            Right = 1
        }
    }
    let truncate: (dir: Truncate.Direction, n: number) => (hex: Hex) => Hex;
    type Truncate = typeof truncate;
    namespace Truncate {
        enum Direction {
            Left = 0,
            Right = 1
        }
    }
    let toDecimal: (hex: Hex) => Decimal;
}
export default Hex;
export { Hex };
