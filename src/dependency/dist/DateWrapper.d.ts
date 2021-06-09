export declare namespace DateWrapper {
    interface State {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
    }
}
export declare class DateWrapper {
    date: Date;
    constructor(date: Date);
    format(): string;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getHour(): number;
    getMinute(): number;
    getSecond(): number;
    setYear(year: number): this;
    setMonth(month: number): this;
    setDay(day: number): this;
    setHour(hour: number): this;
    setMinute(minute: number): this;
    setSecond(second: number): this;
    addMillisecond(ms: number): this;
    addDuration(duration: Duration): this;
    addYear(year: number): this;
    addMonth(month: number): this;
    addDay(day: number): this;
    addHour(hour: number): this;
    addMinute(minute: number): this;
    addSecond(second: number): this;
    subtract(to: this): Duration;
    clone(): DateWrapper;
    static subtract(from: DateWrapper, to: DateWrapper): Duration;
    private getState;
    private stringifyState;
}
export declare class Duration {
    state: Omit<DateWrapper.State, never> & {
        millisecond: number;
    };
    constructor();
    setYear(year: number): this;
    setMonth(month: number): this;
    setDay(day: number): this;
    setHour(hour: number): this;
    setMinute(minute: number): this;
    setSecond(second: number): this;
    setMillisecond(ms: number): this;
    getTime(): number;
    getMonth(): number;
    getYear(): number;
}
export declare namespace Partition {
    interface Conf {
        from: DateWrapper;
        to: DateWrapper;
        offset: Duration;
        step: Duration;
        cb: (from: DateWrapper, to: DateWrapper) => any;
    }
}
export declare let partition: (conf: Partition.Conf) => Promise<void>;
