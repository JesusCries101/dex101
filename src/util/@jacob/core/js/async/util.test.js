"use strict";
exports.__esModule = true;
var util_1 = require("./util");
var R = require("../ramda");
Promise.resolve()
    .then(function () { return ({
    queuefy: util_1.memoizedQueuefy({
        config: {
            maxConcurrency: 3,
            delay: 2e3,
            onDelay: function (config) { return (console.log("delay: " + config.delay + "ms, concurrency: " + config.maxConcurrency)); }
        },
        onExecution: function (api) { return (api.setConfig({
            delay: api.getConfig().delay + 1e2
        })); }
    })
}); })
    .then(function (g) { return (R.compose(function (promises) { return Promise.all(promises); }, function () { return (Array.apply(void 0, Array(10)).map(function (e, i) { return i + 1; })
    .map(function (e) { return function () { return console.log(e); }; })
    .map(function (thunk) { return g.queuefy(thunk); })
    .map(function (thunk) { return thunk(); })); })()
    .then(function () { return console.log('end'); })); });
