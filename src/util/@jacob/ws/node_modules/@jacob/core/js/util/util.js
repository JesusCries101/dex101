"use strict";
exports.__esModule = true;
var T = require("../toolbelt");
var R = require("../ramda");
var N = require("../node");
var loopify = (function (config) {
    var _ = R.deepMerge(function (k, l, r) { return r; })({}, config);
    return (_.async ? (N.promise.loopify(_.pred)(_.thunk)) :
        (function () {
            var pred = _.pred;
            var thunk = _.thunk;
            while (pred())
                thunk();
        })());
});
exports.loopify = loopify;
var errorloopify = (function (config) {
    var _ = R.deepMerge(function (k, l, r) { return r; })({
        onRetry: function (err, i, n) { }
    }, config);
    var fgBreak = false;
    var async = _.async;
    var pred = undefined;
    var thunk = undefined;
    var ret = null;
    var iRetry = 0;
    if (R.isNil(_.nRetry)) {
        pred = function () { return !fgBreak; };
        thunk = function () { return (async ? (T.Promise.resolve()
            .then(function () { return _.thunk(); })
            .then(function (_ret) { return ret = _ret; })
            .then(function () { return fgBreak = true; })["catch"](function (err) { return (T.Promise.resolve()
            .then(function () { return _.onRetry(err, iRetry); })
            .then(function () { return iRetry += 1; })); })["catch"](function () { })) : ((function () {
            try {
                ret = _.thunk();
                fgBreak = true;
            }
            catch (err) {
                try {
                    _.onRetry(err, iRetry);
                }
                catch (err) { }
                iRetry += 1;
            }
        })())); };
    }
    else {
        var nRetry_1 = _.nRetry;
        pred = function () { return !fgBreak && iRetry != nRetry_1; };
        thunk = function () { return (async ? (T.Promise.resolve()
            .then(function () { return _.thunk(); })
            .then(function (_ret) { return ret = _ret; })
            .then(function () { return fgBreak = true; })["catch"](function (err) { return (T.Promise.resolve()
            .then(function () { return _.onRetry(err, iRetry, _.nRetry); })
            .then(function () { return iRetry += 1; })); })["catch"](function () { })) : ((function () {
            try {
                ret = _.thunk();
                fgBreak = true;
            }
            catch (err) {
                try {
                    _.onRetry(err, iRetry, _.nRetry);
                }
                catch (err) { }
                iRetry += 1;
            }
        })())); };
    }
    var loop = function (async) { return loopify({ async: async, thunk: thunk, pred: pred }); };
    return (async ?
        loop(async)["catch"](function () { }).then(function () { return ret; }) : ((function () {
        try {
            loop(async);
        }
        catch (err) { }
        return ret;
    })()));
});
exports.errorloopify = errorloopify;
var Errorloopify;
(function (Errorloopify) {
    ;
})(Errorloopify || (Errorloopify = {}));
exports.Errorloopify = Errorloopify;
