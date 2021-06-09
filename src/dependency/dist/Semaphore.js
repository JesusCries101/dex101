"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Semaphore = function (conf) {
    var val = conf.concurrency;
    var queueResolver = [];
    var dispatch = function () {
        var resolver = queueResolver.shift();
        if (resolver) {
            val--;
            resolver(function () {
                val++;
                dispatch();
            });
        }
    };
    var api = {
        isLocked: function () { return !(0 < val); },
        acquire: function () {
            var ticket = new Promise(function (resolver) { queueResolver.push(resolver); });
            if (!api.isLocked()) {
                dispatch();
            }
            return ticket;
        },
    };
    return api;
};
exports.default = Semaphore;
