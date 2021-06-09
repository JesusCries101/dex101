"use strict";
exports.__esModule = true;
var R = require("../../ramda");
var __1 = require("..");
var numberComparer = (function () { return (function (a, b) { return a < b ? -1 : b < a ? 1 : 0; }); });
exports.numberComparer = numberComparer;
var defaultComparer = (function () { return (function (a, b) { return a === b ? 0 : 1; }); });
exports.defaultComparer = defaultComparer;
var jsonComparer = (function (comparer) {
    if (comparer === void 0) { comparer = defaultComparer(); }
    return (function (a, b) { return (R.and(Object.keys(a).length == Object.keys(b).length, (__1.arrayifyJson(a, function (key, json) { return ({ key: key, val: json[key] }); })
        .every(function (_a) {
        var key = _a.key, val = _a.val;
        return comparer(b[key], val) == 0;
    }))) ? 0 : 1); });
});
exports.jsonComparer = jsonComparer;
var JsonComparer;
(function (JsonComparer) {
    JsonComparer.deepify = (function (jsonComparer) { return (function (comparer) {
        if (comparer === void 0) { comparer = defaultComparer(); }
        return (jsonComparer(function _comparer(a, b) {
            return (R.isJson(a) && R.isJson(b) ?
                jsonComparer(_comparer)(a, b) :
                comparer(a, b));
        }));
    }); });
})(JsonComparer || (JsonComparer = {}));
exports.JsonComparer = JsonComparer;
var arrayComparer = (function (comparer) {
    if (comparer === void 0) { comparer = defaultComparer(); }
    return (function (a, b) { return (a.length == b.length && a.every(function (e, i) { return comparer(e, b[i]) == 0; }) ? 0 : 1); });
});
exports.arrayComparer = arrayComparer;
