"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eq = exports.tr = exports.invertJson = exports.mapJson = exports.keysJson = exports.omitJson = exports.pickJson = exports.getFromJson = exports.N = exports.T = exports.S = void 0;
var S = function (_) { return _; };
exports.S = S;
var T = function () {
    var _ = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _[_i] = arguments[_i];
    }
    return _;
};
exports.T = T;
var N = function (_) { return _; };
exports.N = N;
var getFromJson = function () {
    var keys = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        keys[_i] = arguments[_i];
    }
    return function (json) { return (keys.reduce(function (acc, key) { return (acc || {})[key]; }, json)); };
};
exports.getFromJson = getFromJson;
var pickJson = function (json) {
    var keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keys[_i - 1] = arguments[_i];
    }
    return (keys.reduce(function (acc, key) {
        var _a;
        return !(key in json) ? acc : Object.assign(acc, (_a = {}, _a[key] = json[key], _a));
    }, {}));
};
exports.pickJson = pickJson;
var omitJson = function (json) {
    var keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keys[_i - 1] = arguments[_i];
    }
    return (Object.keys(json).reduce(function (acc, key) {
        var _a;
        return (keys.indexOf(key) != -1 ? acc : Object.assign(acc, (_a = {}, _a[key] = json[key], _a)));
    }, ({})));
};
exports.omitJson = omitJson;
var keysJson = function (json) { return Object.keys(json); };
exports.keysJson = keysJson;
var mapJson = function (json, f) { return (exports.keysJson(json).reduce(function (acc, key) {
    var _a;
    return Object.assign(acc, (_a = {}, _a[key] = f(key, json[key]), _a));
}, {})); };
exports.mapJson = mapJson;
var invertJson = function (json) {
    var inverted = {};
    for (var key in json) {
        inverted[json[key]] = key;
    }
    return inverted;
};
exports.invertJson = invertJson;
var tr = function (_) { return function (f) { return f(_); }; };
exports.tr = tr;
var eq = function (a) { return function (b) { return a === b; }; };
exports.eq = eq;
var flatMap = function (array) { return function (fmap) {
    var retArray = [];
    array
        .forEach(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        retArray.push.apply(retArray, fmap.apply(null, args));
    });
    return retArray;
}; };
Array.prototype.flatMap = function (fmap) {
    return flatMap(this)(fmap);
};
