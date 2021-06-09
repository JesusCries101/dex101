declare namespace Semaphore {
    interface Acquire {
        (): Promise<Release>;
    }
    interface Release {
        (): void;
    }
    interface Resolver {
        (release: Release): void;
    }
    interface Conf {
        concurrency: number;
    }
    interface API {
        isLocked: () => boolean;
        acquire: Acquire;
    }
}
declare let Semaphore: (conf: Semaphore.Conf) => Semaphore.API;
export default Semaphore;
