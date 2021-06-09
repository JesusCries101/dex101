"use strict";
exports.__esModule = true;
var compose_1 = require("./compose");
var merge = (function (resolveKeyClash) { return (function (l, r) { return (compose_1["default"](function (l) { return (Object.keys(r)
    .reduce(function (acc, val) {
    var _a;
    return (acc.concat((_a = {}, _a[val] = (l[val] != undefined ? resolveKeyClash(val, l[val], r[val]) : r[val]), _a)));
}, [])
    .reduce(function (acc, val) { return Object.assign(acc, val); }, l)); }, function () { return (Object.keys(l)
    .reduce(function (acc, val) {
    var _a;
    return acc.concat((_a = {}, _a[val] = l[val], _a));
}, [])
    .reduce(function (acc, val) { return Object.assign(acc, val); }, {})); })()); }); });
exports.merge = merge;
exports["default"] = merge;
