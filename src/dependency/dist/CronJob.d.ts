import { DateWrapper, Duration } from './DateWrapper';
export declare class CronJob {
    private shouldClearJob;
    constructor(conf: CronJob.Conf);
    stop(): void;
}
export declare namespace CronJob {
    interface Conf {
        dateFrom: DateWrapper;
        period: Duration;
        cb: (dateFrom: DateWrapper, ins: CronJob) => any;
    }
}
export default CronJob;
