import * as T from '../toolbelt';
declare type Decimal = T.String & {
    _type0: 'decimal';
};
declare namespace Decimal {
    let isType: (val: any) => val is Decimal;
    let create: (str: string) => Decimal;
}
export default Decimal;
export { Decimal };
