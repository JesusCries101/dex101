"use strict";
exports.__esModule = true;
var Mutex_1 = require("./Mutex");
var R = require("../ramda");
var T = require("../toolbelt");
var N = require("../node");
var ThunkQueue = /** @class */ (function () {
    function ThunkQueue(config) {
        this._ = {
            config: R.deepMerge(function (k, l, r) { return r; })({
                onDelay: function (config) { return (console.log("delay: " + config.delay + "ms, concurrency: " + config.maxConcurrency)); }
            }, config),
            queueTask: [],
            mutex: new Mutex_1["default"]({}),
            fgRun: true
        };
    }
    ThunkQueue.prototype.getConfig = function () {
        return R.deepMerge(function (k, l, r) { return r; })({}, this._.config);
    };
    ThunkQueue.prototype.setConfig = function (config) {
        this._.config = R.deepMerge(function (k, l, r) { return r; })(this._.config, config);
    };
    ThunkQueue.prototype.push = function (thunk) {
        if (thunk === void 0) { thunk = function () { }; }
        var p = this;
        return new Promise(function (resolve, reject) { return (Promise.resolve()
            .then(function () { return p._.mutex.acquire(); })
            .then(function () { return p._.queueTask.push({ thunk: thunk, resolve: resolve, reject: reject }); })
            .then(function () { return p._.mutex.release(); })
            .then(function () { return (p._.fgRun ? (p._.fgRun = false,
            p.run()) : undefined); })); });
    };
    ThunkQueue.prototype.run = function () {
        var p = this;
        return (Promise.resolve()
            .then(function () { return (Array.apply(void 0, Array(R.min(p._.queueTask.length, p._.config.maxConcurrency))).map(function () { return p._.queueTask.shift(); })
            .map(function (task) { return task; })
            .map(function (task) { return (Promise.resolve()
            .then(function () { return task.thunk(); })
            .then(task.resolve, task.reject)); })); })
            .then(function (promises) { return Promise.all(promises); })
            .then(function () { return p.next(); }));
    };
    ThunkQueue.prototype.next = function () {
        var p = this;
        return (R.pipe(function () { return (Promise.resolve()
            .then(function () { return p._.config.onDelay(T.pickJson(p._.config, 'maxConcurrency', 'delay')); })
            .then(function () { return N.promise.waitFor(p._.config.delay); })); }, R.then(function () { return (p._.queueTask.length != 0 ? (p.run()) : (p._.fgRun = true,
            undefined)); }))());
    };
    return ThunkQueue;
}());
exports.ThunkQueue = ThunkQueue;
exports["default"] = ThunkQueue;
