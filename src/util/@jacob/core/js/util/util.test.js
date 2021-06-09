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
var util_1 = require("./util");
var T = require("../toolbelt");
var N = require("../node");
T.Promise.resolve({
    i: 0,
    j: 0
})
    .then(function (_) { return (__assign(__assign({}, _), { thunks: [
        function () { return (util_1.loopify({
            async: true,
            thunk: function () { return (T.Promise.resolve()
                .then(function () { return console.log(_.i++); })
                .then(function () { return N.promise.waitFor(5e2); })); },
            pred: function () { return _.i < 15; }
        })); },
        function () { return (util_1.errorloopify({
            async: true,
            thunk: function () { return (T.Promise.resolve()
                .then(function () { return N.promise.waitFor(1e3); })
                .then(function () { return (_.j++ < 2 ?
                T.Promise.reject(new Error('not yet')) :
                1221); })); },
            nRetry: 3,
            onRetry: function (err, i, n) { return (console.log(err.stack),
                console.log(i + 1 + "/" + n)); }
        })); }
    ] })); })
    .then(function (_) { return (T.Promise.resolve()
    .then(function () { return _.thunks[1](); })
    .then(console.log)); });
