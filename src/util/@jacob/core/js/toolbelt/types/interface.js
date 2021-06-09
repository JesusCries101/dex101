"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var T = require("../../toolbelt");
var index = require("../");
var R = require("../../ramda");
var Dictionary;
(function (Dictionary) {
    Dictionary.isType = (function (val) { return (R.isJson(val) && val._type0 === 'dictionary'); });
    Dictionary.create = (function (json) { return (T.Object.assign(json, { _type0: index.string.create('dictionary') })); });
    Dictionary.undo = (function (dictionary) { return JsonTransform.deepify(T.json.remove)(dictionary, '_type0'); });
})(Dictionary || (Dictionary = {}));
exports.Dictionary = Dictionary;
var JsonTransform;
(function (JsonTransform) {
    JsonTransform.deepify = (function (tr) { return (function (json) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return (T.mapJson(tr.apply(void 0, __spreadArrays([json], args)), function (key, json) { return (R.isJson(json[key]) ? JsonTransform.deepify(tr).apply(void 0, __spreadArrays([json[key]], args)) :
            json[key]); }));
    }); });
})(JsonTransform || (JsonTransform = {}));
exports.JsonTransform = JsonTransform;
