declare let mkdirSync: <TRecursive extends boolean>(recursive: TRecursive) => (folderpath: string) => boolean;
declare type MkdirSync = typeof mkdirSync;
declare let writeFileSync: (blobpath: string, data: string) => boolean;
declare type WriteFileSync = typeof writeFileSync;
declare let unlinkSync: (blobpath: string) => boolean;
declare type UnlinkSync = typeof unlinkSync;
declare let rmdirSync: <TRecursive extends boolean>(recursive: TRecursive) => (folderpath: string) => boolean;
declare type RmdirSync = typeof rmdirSync;
export { mkdirSync, MkdirSync, writeFileSync, WriteFileSync, unlinkSync, UnlinkSync, rmdirSync, RmdirSync };
