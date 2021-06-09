"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partition = exports.Duration = exports.DateWrapper = void 0;
var DateWrapper = /** @class */ (function () {
    function DateWrapper(date) {
        this.date = date;
    }
    DateWrapper.prototype.format = function () {
        var state = this.getState();
        for (var key in state) {
            if (state[key] < 10) {
                state[key] = "0" + state[key];
            }
        }
        return this.stringifyState(state);
    };
    DateWrapper.prototype.getYear = function () {
        return this.date.getFullYear();
    };
    DateWrapper.prototype.getMonth = function () {
        return this.date.getMonth() + 1;
    };
    DateWrapper.prototype.getDay = function () {
        return this.date.getDate();
    };
    DateWrapper.prototype.getHour = function () {
        return this.date.getHours();
    };
    DateWrapper.prototype.getMinute = function () {
        return this.date.getMinutes();
    };
    DateWrapper.prototype.getSecond = function () {
        return this.date.getSeconds();
    };
    DateWrapper.prototype.setYear = function (year) {
        var state = this.getState();
        state.year = year;
        this.date = new Date(this.stringifyState(state));
        return this;
    };
    DateWrapper.prototype.setMonth = function (month) {
        var state = this.getState();
        state.month = month;
        this.date = new Date(this.stringifyState(state));
        return this;
    };
    DateWrapper.prototype.setDay = function (day) {
        var state = this.getState();
        state.day = day;
        this.date = new Date(this.stringifyState(state));
        return this;
    };
    DateWrapper.prototype.setHour = function (hour) {
        var state = this.getState();
        state.hour = hour;
        this.date = new Date(this.stringifyState(state));
        return this;
    };
    DateWrapper.prototype.setMinute = function (minute) {
        var state = this.getState();
        state.minute = minute;
        this.date = new Date(this.stringifyState(state));
        return this;
    };
    DateWrapper.prototype.setSecond = function (second) {
        var state = this.getState();
        state.second = second;
        this.date = new Date(this.stringifyState(state));
        return this;
    };
    DateWrapper.prototype.addMillisecond = function (ms) {
        this.date = new Date(this.date.getTime() + ms);
        return this;
    };
    DateWrapper.prototype.addDuration = function (duration) {
        return this.addMillisecond(duration.getTime()).addMonth(duration.getMonth()).addYear(duration.getYear());
    };
    DateWrapper.prototype.addYear = function (year) {
        return this.setYear(this.getYear() + year);
    };
    DateWrapper.prototype.addMonth = function (month) {
        var monthTotal = this.getMonth() + month;
        return this.addYear(Math.floor((monthTotal - 1) / 12)).setMonth(((monthTotal - 1) % 12) + 1);
    };
    DateWrapper.prototype.addDay = function (day) {
        return this.addMillisecond(1e3 * 60 * 60 * 24 * day);
    };
    DateWrapper.prototype.addHour = function (hour) {
        return this.addMillisecond(1e3 * 60 * 60 * hour);
    };
    DateWrapper.prototype.addMinute = function (minute) {
        return this.addMillisecond(1e3 * 60 * minute);
    };
    DateWrapper.prototype.addSecond = function (second) {
        return this.addMillisecond(1e3 * second);
    };
    DateWrapper.prototype.subtract = function (to) {
        return DateWrapper.subtract(this, to);
    };
    DateWrapper.prototype.clone = function () {
        return new DateWrapper(new Date(this.date.getTime()));
    };
    DateWrapper.subtract = function (from, to) {
        return new Duration().setMillisecond(from.date.getTime() - to.date.getTime());
    };
    DateWrapper.prototype.getState = function () {
        return {
            year: this.getYear(),
            month: this.getMonth(),
            day: this.getDay(),
            hour: this.getHour(),
            minute: this.getMinute(),
            second: this.getSecond(),
        };
    };
    DateWrapper.prototype.stringifyState = function (state) {
        return state.year + "-" + state.month + "-" + state.day + " " + state.hour + ":" + state.minute + ":" + state.second;
    };
    return DateWrapper;
}());
exports.DateWrapper = DateWrapper;
var Duration = /** @class */ (function () {
    function Duration() {
        this.state = {
            day: 0,
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
            month: 0,
            year: 0,
        };
    }
    Duration.prototype.setYear = function (year) {
        this.state.year = year;
        return this;
    };
    Duration.prototype.setMonth = function (month) {
        this.state.month = month;
        return this;
    };
    Duration.prototype.setDay = function (day) {
        this.state.day = day;
        return this;
    };
    Duration.prototype.setHour = function (hour) {
        this.state.hour = hour;
        return this;
    };
    Duration.prototype.setMinute = function (minute) {
        this.state.minute = minute;
        return this;
    };
    Duration.prototype.setSecond = function (second) {
        this.state.second = second;
        return this;
    };
    Duration.prototype.setMillisecond = function (ms) {
        this.state.millisecond = ms;
        return this;
    };
    Duration.prototype.getTime = function () {
        return (this.state.millisecond +
            1e3 * this.state.second +
            1e3 * 60 * this.state.minute +
            1e3 * 60 * 60 * this.state.hour +
            1e3 * 60 * 60 * 24 * this.state.day);
    };
    Duration.prototype.getMonth = function () {
        return this.state.month;
    };
    Duration.prototype.getYear = function () {
        return this.state.year;
    };
    return Duration;
}());
exports.Duration = Duration;
var partition = function (conf) { return ((function (from, end, offset, step) {
    return new Promise(function (resolve, reject) {
        (function f(from, to) {
            if (!(from < end)) {
                resolve();
            }
            else {
                Promise.resolve()
                    .then(function () { return ((function (from, to) { return (conf.cb(from, to)); })(new DateWrapper(new Date(from)), new DateWrapper(new Date(to)))); })
                    .then(function () { return f(to, Math.min(to + step, end)); })
                    .catch(reject);
            }
        })(from, from + offset);
    });
})(conf.from.date.getTime(), conf.to.date.getTime(), conf.offset.getTime(), conf.step.getTime())); };
exports.partition = partition;
