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
var __1 = require("../");
var core_1 = require("@jacob/core");
core_1.toolbelt.Promise.resolve({
    proxy: new __1["default"]({
        address: 'ws://127.0.0.1:7650/',
        port: 8080
    })
})
    .then(function (_) { return (_.proxy.start()
    .then(function (proxy) { return (__assign(__assign({}, _), { proxy: proxy })); })); })["catch"](console.error);
