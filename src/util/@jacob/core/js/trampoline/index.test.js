"use strict";
exports.__esModule = true;
var index_1 = require("./index");
var R = require("../ramda");
var factorial = index_1.trampoline(function (n, acc) {
    if (acc === void 0) { acc = 1; }
    return (n == 1 ? index_1.Trampoline.crack(acc) : index_1.Trampoline.bounce(n - 1, acc * n));
});
var sum = index_1.trampoline(function (n, acc) {
    if (acc === void 0) { acc = 0; }
    return (n == 0 ? index_1.Trampoline.crack(acc) : index_1.Trampoline.bounce(n - 1, acc + n));
});
var findArrayInnerElems = index_1.trampoline(function (array, acc) {
    if (acc === void 0) { acc = []; }
    return (array
        .map(function (e) { return (R.isArray(e) ?
        index_1.Trampoline.bounce(e, []) :
        index_1.Trampoline.crack([e])); })
        .reduce(function (acc0, val0) { return (index_1.Trampoline.combine(acc0, val0)(function () {
        var rets = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rets[_i] = arguments[_i];
        }
        return (rets.reduce(function (acc, val) { return acc.concat(val); }, []));
    })); }, index_1.Trampoline.crack(acc)));
});
console.log(
//sum(1e6)
findArrayInnerElems([1, [2, 4], [33, [22]]]));
