"use strict";
exports.__esModule = true;

var isNil = (function (arg) { return (arg == null || arg == undefined); });
exports.isNil = isNil;
var isNumber = (function (arg) { return (typeof arg === 'number'); });
exports.isNumber = isNumber;
var isArray = (function (arg) { return (Array.isArray(arg)); });
exports.isArray = isArray;
var isJson = (function (arg) { return (!isNil(arg) && typeof arg === 'object' && !isArray(arg)); });
exports.isJson = isJson;
var isString = (function (arg) { return (typeof arg === 'string'); });
exports.isString = isString;
var then = (function (onSuccess) { return (function (promise) { return (promise.then(onSuccess)); }); });
exports.then = then;
var min = (function (arg) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return (args
        .reduce(function (acc, val) { return (acc < val ? acc : val); }, arg));
});
exports.min = min;
var max = (function (arg) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return (args
        .reduce(function (acc, val) { return (val < acc ? acc : val); }, arg));
});
exports.max = max;
var and = (function (arg) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return (args.reduce(function (acc, val) { return acc && val; }, arg));
});
exports.and = and;
var or = (function (arg) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return (args.reduce(function (acc, val) { return acc || val; }, arg));
});
exports.or = or;
