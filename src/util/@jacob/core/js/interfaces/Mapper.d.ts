import { Record, String, Boolean } from '../toolbelt';
interface Mapper<async extends Boolean = true, TBuffer = any, TSrc extends String = String, TDest extends String = String> {
    async: async;
    mapSrc2Dest: Record<TSrc, TDest>;
    readFrom: (src: TSrc) => async extends true ? Promise<TBuffer> : TBuffer;
    writeTo: (dest: TDest) => (buf: TBuffer) => async extends true ? Promise<void> : void;
}
declare namespace Mapper {
    let exec: <TMapper extends Mapper<boolean, any, string, string>>(mapper: TMapper) => TMapper["async"] extends true ? Promise<void> : void;
    type Exec = typeof exec;
}
export default Mapper;
export { Mapper };
