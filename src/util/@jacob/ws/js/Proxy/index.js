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
var util = require("../util");
var Proxy = /** @class */ (function () {
    function Proxy(config) {
        this._ = {
            config: core_1.ramda.deepMerge(function (k, l, r) { return r; })({}, config),
            id: 0,
            channelById: new Map(),
            wss: undefined
        };
    }
    Proxy.prototype.start = function () {
        var p = this;
        return new core_1.toolbelt.Promise(function (resolve, reject) { return (core_1.toolbelt.Promise.resolve({
            wss: core_1.toolbelt.nullifyError(function () { return new Websocket.Server(__assign({}, core_1.toolbelt.json.pick(p._.config, 'port'))); })()
        })
            .then(function (_) { return (core_1.ramda.isNil(_.wss) ?
            reject(new core_1.toolbelt.Error('server init failure')) : (p._ = __assign(__assign({}, p._), { wss: _.wss }),
            p._.wss
                .on('listening', function () { return resolve(p); })
                .on('error', console.error)
                .on('connection', function (ws, req) { return (ws.on('message', function (data) {
                console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvv');
            }),
                core_1.util.util.errorloopify({
                    async: true,
                    thunk: function () { return util.createWebsocket(p._.config.address); },
                    onRetry: function (err, i, n) { return (core_1.toolbelt.Promise.resolve()
                        .then(function () { return (console.log(err.message),
                        console.log(i + 1 + "/" + n)); })
                        .then(function () { return core_1.node.promise.waitFor(5e3); })); }
                })
                    .then(function (wsServer) { return (core_1.ramda.isNil(wsServer) ?
                    core_1.toolbelt.Promise.reject(new core_1.toolbelt.Error('websocket init failure')) : (p._.channelById.set(p._.id, {
                    wsClient: ws,
                    wsServer: wsServer
                }),
                    establishChannels(p),
                    p._.id += 1,
                    undefined)); })["catch"](console.error)); }))); })["catch"](reject)); });
    };
    return Proxy;
}());
exports.Proxy = Proxy;
function establishChannels(proxy) {
    proxy._.channelById
        .forEach(function (channel, id, map) { return (channel.wsClient
        .on('close', function () { return (terminateChannel(channel),
        map["delete"](id)); })
        .on('message', function (data) { return (channel.wsServer.send(data)); }),
        channel.wsServer
            .on('close', function () { return (terminateChannel(channel),
            map["delete"](id)); })
            .on('message', function (data) { return (channel.wsClient.send(data)); })); });
}
function terminateChannel(channel) {
    [channel.wsClient, channel.wsServer]
        .forEach(function (ws) { return (ws.readyState != Websocket.CLOSED &&
        ws.readyState != Websocket.CLOSING && (ws.close())); });
}
exports["default"] = Proxy;
