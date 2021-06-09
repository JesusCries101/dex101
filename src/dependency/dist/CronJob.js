"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronJob = void 0;
var DateWrapper_1 = require("./DateWrapper");
var CronJob = /** @class */ (function () {
    function CronJob(conf) {
        var this_ = this;
        new Promise(function (resolve, _) {
            (function f(dateCurr) {
                if (dateCurr === void 0) { dateCurr = conf.dateFrom; }
                if (this_.shouldClearJob) {
                    resolve();
                }
                else {
                    var dateNow = new DateWrapper_1.DateWrapper(new Date());
                    if (!(dateNow.date.getTime() < dateCurr.date.getTime())) {
                        var g = function () { return setTimeout(function () { return f(dateCurr.addDuration(conf.period)); }, 1); };
                        Promise.resolve()
                            .then(function () { return conf.cb(dateCurr.clone(), this_); })
                            .then(g)
                            .catch(g);
                    }
                    else {
                        setTimeout(function () { return f(dateCurr); }, 1);
                    }
                }
            })();
        });
    }
    CronJob.prototype.stop = function () { this.shouldClearJob = true; };
    return CronJob;
}());
exports.CronJob = CronJob;
exports.default = CronJob;
