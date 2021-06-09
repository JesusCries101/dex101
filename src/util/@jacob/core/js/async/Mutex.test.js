"use strict";
exports.__esModule = true;
var Mutex_1 = require("./Mutex");
var N = require("../node");
Promise.resolve()
    .then(function () { return ({
    mutex: new Mutex_1["default"]({})
}); })
    .then(function (_) { return (Promise.resolve()
    .then(function () { return (Array.apply(void 0, Array(20)).map(function (e, i) { return i + 1; })
    .map(function (e) { return (Promise.resolve()
    .then(function () { return _.mutex.acquire(); })
    .then(function () { return console.log(e); })
    .then(function () { return N.promise.waitFor(1e3); })
    .then(function () { return _.mutex.release(); })); })); })
    .then(function (promises) { return Promise.all(promises); })
    .then(function () { return console.log('end'); })); });
