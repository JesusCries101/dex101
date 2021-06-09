"use strict";
exports.__esModule = true;
var merge_1 = require("./merge");
var deepMerge = (function (resolveKeyClash) { return (function (l, r) { return (merge_1["default"](function (k, l, r) { return ([l, r].every(function (e) { return typeof e === 'object' && !Array.isArray(e); }) ?
    deepMerge(resolveKeyClash)(l, r) :
    resolveKeyClash(k, l, r)); })(l, r)); }); });
exports.deepMerge = deepMerge;
exports["default"] = deepMerge;
