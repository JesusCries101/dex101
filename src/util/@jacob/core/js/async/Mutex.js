"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var events_1 = require("events");
var R = require("../ramda");
var N = require("../node");
var Mutex = /** @class */ (function () {
    function Mutex(config) {
        this._ = {
            emitter: new events_1.EventEmitter(),
            fgLocked: false,
            config: R.deepMerge(function (k, l, r) { return r; })({
                maxListeners: Number.MAX_SAFE_INTEGER
            }, config)
        };
        this._ = __assign(__assign({}, this._), { emitter: this._.emitter.setMaxListeners(this._.config.maxListeners) });
    }
    Mutex.prototype.acquire = function () {
        var p = this;
        return new Promise(function (resolve, reject) { return (function () {
            var fgAcquire = true;
            try {
                let _ = !p._.fgLocked ? (p._.fgLocked = true,
                    fgAcquire = false,
                    resolve()) : (p._.emitter.on('release', function tryAcquire() {
                    _ = !p._.fgLocked && (p._.fgLocked = true,
                        fgAcquire = false,
                        resolve(),
                        p._.emitter.removeListener('release', tryAcquire));
                }),
                    N.promise.waitUntil(function () { return !fgAcquire; }));
            }
            catch (err) {
                reject(err);
            }
        })(); });
    };
    Mutex.prototype.release = function () {
        var p = this;
        return new Promise(function (resolve, reject) { return (function () {
            try {
                let _ = (p._.fgLocked = false,
                    setImmediate(function () { return (p._.emitter.emit('release'),
                        resolve()); }));
            }
            catch (err) {
                reject(err);
            }
        })(); });
    };
    return Mutex;
}());
exports.Mutex = Mutex;
exports["default"] = Mutex;
