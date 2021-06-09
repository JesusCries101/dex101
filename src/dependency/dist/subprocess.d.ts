/// <reference types="node" />
import * as childProcess from 'child_process';
export declare let exec: (cmd: string, cwd?: string) => Promise<{
    stdout: string;
    stderr: string;
}> & {
    subprocess: childProcess.ChildProcess;
};
