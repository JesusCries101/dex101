"use strict";
exports.__esModule = true;
var monkeypatch = (function (method, cb) { return (function (emitter) {
    var fn = emitter[method];
    emitter[method] = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        cb(args);
        return fn.apply(emitter, args);
    };
    return emitter;
}); });
exports.monkeypatch = monkeypatch;
