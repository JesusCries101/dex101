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
var Ws = require("../common");
var Server = /** @class */ (function () {
    function Server(config) {
        this._ = {
            config: core_1.ramda.deepMerge(function (k, l, r) { return r; })({}, config),
            wss: undefined
        };
    }
    Server.prototype.start = function () {
        var p = this;
        return new core_1.toolbelt.Promise(function (resolve, reject) { return (core_1.toolbelt.Promise.resolve({
            wss: core_1.toolbelt.nullifyError(function () { return new Websocket.Server(__assign({}, core_1.toolbelt.json.pick(p._.config, 'port'))); })()
        })
            .then(function (_) { return (core_1.ramda.isNil(_.wss) ?
            reject(new core_1.toolbelt.Error('server init failure')) : (p._ = __assign(__assign({}, p._), { wss: _.wss }),
            p._.wss
                .on('listening', function () { return resolve(p); })
                .on('error', console.error)
                .on('connection', function (ws, req) { return (ws
                .on('message', function (data) { return (core_1.toolbelt.Promise.resolve()
                .then(function () { return p._.config.dataToReqAction(data.toString()); })
                .then(function (reqAction) { return p._.config.reqActionToResAction(reqAction); })
                .then(function (resAction) { return p._.config.resActionToData(resAction); })
                .then(function (data) { return ws.send(data, function (err) { return (err && console.error(err)); }); })["catch"](console.error)); })); }))); })); });
    };
    return Server;
}());
exports.Server = Server;
(function (Server) {
    Server.Common = Ws;
})(Server || (Server = {}));
exports.Server = Server;
exports["default"] = Server;
