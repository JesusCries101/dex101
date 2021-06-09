/// <reference types="node" />
import { ChildProcess } from 'child_process';
declare let promisify: (subprocess: ChildProcess | Promise<ChildProcess>) => (stdinData: string) => Promise<string>;
declare type Promisify = typeof promisify;
declare let makeSubprocess: (cmd: string) => Promise<ChildProcess>;
declare type MakeSubprocess = typeof makeSubprocess;
export { promisify, Promisify, makeSubprocess, MakeSubprocess };
