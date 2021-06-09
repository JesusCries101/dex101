"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var uniquify = (function (array) { return function () { return (array
    .reduce(function (acc, val) { return (acc.indexOf(val) != -1 ? acc : acc.concat(val)); }, [])); }; });
exports.uniquify = uniquify;
var mutativeFilter = (function (array) { return function (pred, thisArg) { return (pred = pred.bind(thisArg),
    (function () {
        var indices = [];
        var arrayFiltered = (array
            .reduce(function (acc, val, index) { return (pred(val, index, array) ? (indices.push(index), acc.concat(val)) : acc); }, []));
        while (indices.length > 0) {
            var index = indices.pop();
            array.splice(index, 1);
        }
        return arrayFiltered;
    })()); }; });
exports.mutativeFilter = mutativeFilter;
var flexibleIndexOf = (function (array) { return function (val, comparer) {
    var index = -1;
    for (var i = 0, iEnd = array.length; i < iEnd; ++i) {
        if (comparer(array[i], val) == 0) {
            index = i;
            break;
        }
    }
    return index;
}; });
exports.flexibleIndexOf = flexibleIndexOf;
var string;
(function (string) {
    string.split = (function (config) { return (function (str) {
        var trDelim = config.trDelim, once = config.once, arrayDelim = config.arrayDelim;
        var arrayNode = [{ val: str, isDelim: false }];
        arrayDelim
            .forEach(function (delim) {
            for (var i = 0, iEnd = arrayNode.length; i < iEnd; i += 1) {
                var _a = arrayNode[i], str_1 = _a.val, isDelim = _a.isDelim;
                if (!isDelim) {
                    var arraySubstr = str_1.split(delim);
                    if (arraySubstr.length > 1) {
                        arrayNode.splice.apply(arrayNode, __spreadArrays([i, 1], ((once ? [arraySubstr.shift(), trDelim(delim), arraySubstr.join(delim)] : (arraySubstr
                            .map(function (str, i, array) { return i != array.length - 1 ? [str, trDelim(delim)] : [str]; })
                            .reduce(function (acc, val) { return acc.concat(val); }, [])))
                            .map(function (str, i) { return ({ val: str, isDelim: i % 2 != 0 }); }))));
                        if (once)
                            break;
                        i = -1; 
                        iEnd = arrayNode.length;
                    }
                }
            }
        });
        return arrayNode.map(function (_a) {
            var val = _a.val;
            return val;
        }).filter(function (val) { return val !== ''; });
    }); });
})(string || (string = {}));
exports.string = string;
