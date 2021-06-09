"use strict";
exports.__esModule = true;
var T = require("../../toolbelt");
var waitUntil = (function (pred) { return (new Promise(function (resolve, reject) {
    var checkPred = function () { return setTimeout(function () {
        Promise.resolve()
            .then(function () { return pred(); })
            .then(function (pass) { return pass ? resolve() : checkPred(); })["catch"](reject);
    }, 1e2); };
    checkPred();
})); });
exports.waitUntil = waitUntil;
var waitFor = (function (ms) { return (new Promise(function (resolve, reject) {
    try {
        setTimeout(resolve, ms);
    }
    catch (err) {
        reject(err);
    }
})); });
exports.waitFor = waitFor;
var loopify = (function (pred) { return (function (thunk) { return (
/*
(async () => {
  while (await T.Promise.resolve().then(pred)) {
    await T.Promise.resolve().then(thunk);
  }
})()
*/
new T.Promise(function (resolve, reject) { return (T.Promise.resolve()
    .then(function () { return pred(); })
    .then(function (pass) { return (pass ?
    T.Promise.resolve()
        .then(function () { return thunk(); })
        .then(function () { return (setImmediate(function () { return (loopify(pred)(thunk)
        .then(resolve)["catch"](reject)); })); }) :
    resolve()); })["catch"](reject)); })); }); });
exports.loopify = loopify;
var statefulLoopify = (function (_) { return (function (pred) { return (function (thunk) { return (loopify(function () { return pred(_)(); })(function () { return thunk(_)(); })); }); }); });
exports.statefulLoopify = statefulLoopify;
