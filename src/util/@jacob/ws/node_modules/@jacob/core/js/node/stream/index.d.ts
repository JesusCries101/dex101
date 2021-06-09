/// <reference types="node" />
import * as stream from 'stream';
declare let promisify: (op: "pipe") => (rstream: stream.Readable | NodeJS.ReadableStream, wstream: stream.Writable | NodeJS.WritableStream) => Promise<void>;
export { promisify };
