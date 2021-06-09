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
var core_1 = require("@jacob/core");
var Websocket = require("isomorphic-ws");
var Client = /** @class */ (function () {
    function Client(config) {
        this._ = {
            config: core_1.ramda.deepMerge(function (k, l, r) { return r; })({}, config),
            ws: undefined,
            resPayloadByType: {},
            fgStarted: false,
            queuefy: (core_1.async.memoizedQueuefy({
                config: {
                    maxConcurrency: 1,
                    delay: 1e2
                },
                onExecution: function () { }
            }))
        };
    }
    Client.prototype.start = function () {
        var p = this;
        p._.fgStarted = true;
        return new Promise(function (resolve, reject) { return (core_1.toolbelt.Promise.resolve({
            ws: core_1.toolbelt.nullifyError(function () { return new Websocket(p._.config.address); })()
        })
            .then(function (_) { return (core_1.ramda.isNil(_.ws) ?
            core_1.toolbelt.Promise.reject(new core_1.toolbelt.Error('websocket init failed')) : (p._ = __assign(__assign({}, p._), { ws: _.ws }),
            p._.ws
                .on('open', function () { return resolve(p); })
                .on('error', reject)
                .on('message', function (data) { return (core_1.toolbelt.Promise.resolve()
                .then(function () { return p._.config.extractResAction(data.toString()); })
                .then(function (resAction) { return (core_1.toolbelt.Promise.resolve(resAction)
                .then(function (_a) {
                var type = _a.type, payload = _a.payload;
                return p._.resPayloadByType[type] = payload;
            })
                .then(function () { return undefined; })); })["catch"](function () { return (core_1.toolbelt.json.arrayify(p._.resPayloadByType, function (key, json) { return function () { return (json[key] = {}, undefined); }; })
                .reduce(function (acc, val) { return function () { return (acc(), val()); }; }, function () { })()); })); }))); })["catch"](reject)); });
    };
    Client.prototype.makeAction = function (type, payload) {
        return { type: type, payload: payload };
    };
    Client.prototype.dispatch = function (action) {
        var p = this;
        return p._.queuefy(function () { return new Promise(function (resolve, reject) { return (core_1.toolbelt.Promise.resolve()
            .then(function () { return (p._.fgStarted ?
            undefined :
            p.start().then(function () { return undefined; })); })
            .then(function () { return (p._.resPayloadByType[action.type] = null, (p._.ws.readyState == p._.ws.OPEN ?
            p._.ws.send(p._.config.reduceReqAction(action)) :
            core_1.toolbelt.Promise.reject(new Error('websocket not ready')))); })
            .then(function () { return (core_1.node.promise.waitUntil(function () { return !core_1.ramda.isNil(p._.resPayloadByType[action.type]); })
            .then(function () { return (resolve({
            type: action.type,
            payload: (core_1.toolbelt.json.length(p._.resPayloadByType[action.type]) == 0 ?
                null : p._.resPayloadByType[action.type])
        }),
            delete p._.resPayloadByType[action.type]); })); })["catch"](reject)); }); })();
    };
    Client.prototype.kill = function () {
        var p = this;
        if (p._.fgStarted) {
            p._.fgStarted = false;
            p._.ws.close();
        }
    };
    return Client;
}());
exports.Client = Client;
exports["default"] = Client;
