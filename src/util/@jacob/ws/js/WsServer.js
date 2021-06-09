"use strict";
exports.__esModule = true;
var Websocket = require("isomorphic-ws");
var wss = new Websocket.Server({
    port: 7650
});
wss.on('connection', function (ws, req) { return (console.log('connected')); });
