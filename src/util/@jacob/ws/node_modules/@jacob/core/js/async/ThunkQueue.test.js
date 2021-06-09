"use strict";
exports.__esModule = true;
var ThunkQueue_1 = require("./ThunkQueue");
var N = require("../node");
Promise.resolve()
    .then(function () { return ({
    thunkQueue: new ThunkQueue_1["default"]({
        maxConcurrency: 3,
        delay: 3e3,
        onDelay: function (config) { return (console.log("delay: " + config.delay + "ms, concurrency: " + config.maxConcurrency)); }
    })
}); })
    .then(function (_) { return (Promise.resolve()
    .then(function () { return (Array.apply(void 0, Array(20)).map(function (e, i) { return i + 1; })
    .map(function (e) { return function () { return console.log(e); }; })
    .map(function (thunk) { return (N.promise.waitFor(Math.random() * 3e3)
    .then(function () { return _.thunkQueue.push(thunk); })); })); })
    .then(function (promises) { return Promise.all(promises); })
    .then(function () { return console.log('end'); })); })["catch"](console.error);
