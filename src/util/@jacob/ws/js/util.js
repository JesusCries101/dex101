"use strict";
exports.__esModule = true;
var core_1 = require("@jacob/core");
var Websocket = require("isomorphic-ws");
exports.createWebsocket = (function (address) { return (new core_1.toolbelt.Promise(function (resolve, reject) { return (core_1.toolbelt.Promise.resolve({
    ws: core_1.toolbelt.nullifyError(function () { return new Websocket(address); })()
})
    .then(function (_) { return (core_1.ramda.isNil(_.ws) ?
    reject(new core_1.toolbelt.Error('websocket init failure')) : ((function (ws) { return (ws
    .on('open', function () { return resolve(ws); })
    .on('error', reject)); })(_.ws))); })); })); });
