"use strict";
exports.__esModule = true;
var Websocket = require("isomorphic-ws");
var WebsocketClient = /** @class */ (function () {
    function WebsocketClient(config) {
        this.config = config;
        this.ws = null;
        this.mapType2ResPayload = {};
    }
    WebsocketClient.prototype.start = function () {
        var p = this;
        return new Promise(function (resolve, reject) { return (p.ws = (function () {
            try {
                return new Websocket(p.config.address);
            }
            catch (err) {
                reject(err);
                return null;
            }
        })(),
            p.ws && (p.ws
                .on('open', function () { return (resolve(p)); })
                .on('error', function (err) { return (reject(err)); })
                .on('message', function (data) {
                var _a = p.config.messageDigester(data.toString()), type = _a.type, payload = _a.payload;
                type && payload && (p.mapType2ResPayload[type] = payload);
            }))); });
    };
    WebsocketClient.prototype.kill = function () {
        var p = this;
        p.ws && p.ws.close();
    };
    WebsocketClient.prototype.dispatch = function (type, payload) {
        var p = this;
        p.ws && p.ws.send(p.config.actionReducer(p.config.makeAction(type, payload)));
        return new Promise(function (resolve, reject) {
            var fn = function () { return (setTimeout(function () { return (typeof p.mapType2ResPayload[type] !== 'undefined' ?
                (resolve({ type: type, payload: p.mapType2ResPayload[type] }), delete p.mapType2ResPayload[type]) :
                fn()); }, 1e2)); };
            fn();
        });
    };
    return WebsocketClient;
}());
exports.WebsocketClient = WebsocketClient;
exports["default"] = WebsocketClient;
