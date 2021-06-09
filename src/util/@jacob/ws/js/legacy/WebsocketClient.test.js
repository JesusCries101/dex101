"use strict";
exports.__esModule = true;
var WebsocketClient_1 = require("./WebsocketClient");
new WebsocketClient_1["default"]({
    address: 'wss://api.cryptosx.io/WSGateway/',
    makeAction: function fn(type, payload) {
        var typeDeducers = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            typeDeducers[_i - 2] = arguments[_i];
        }
        return (type === 'AuthenticateUser' ?
            ({ type: type, payload: payload }) :
            ({ type: type, payload: payload }));
    },
    actionReducer: function (action) {
        var _a;
        return (JSON.stringify((_a = {},
            _a['m'] = 0,
            _a['i'] = 0,
            _a['n'] = action.type,
            _a['o'] = JSON.stringify(action.payload),
            _a)));
    },
    messageDigester: function (msg) {
        var typeDeducers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            typeDeducers[_i - 1] = arguments[_i];
        }
        try {
            var parsed = JSON.parse(msg);
            var type = parsed['n'];
            var _payload = JSON.parse(parsed['o']);
            if (type === 'AuthenticateUser') {
                var payload = {
                    authenticated: _payload['Authenticated'] || false
                };
                return { type: type, payload: payload };
            }
            else if (type === 'GetAccountInfo') {
                var payload = _payload;
                return { type: type, payload: payload };
            }
            return {};
        }
        catch (err) {
            return {};
        }
    }
})
    .start()
    .then(function (client) { return (console.log('client started'),
    setTimeout(function () { return (client.dispatch('AuthenticateUser', {
        UserName: 'JacobTheProgrammer',
        Password: 'Password123'
    })
        .then(function (s) { return console.log(s); })
        .then(function () { return console.log('mark'); })
        .then(function () { return client.dispatch('AuthenticateUser', {
        UserName: 'JacobTheProgrammer',
        Password: 'Password1'
    }); })
        .then(function (s) { return console.log(s); })
        .then(function () { return console.log('mark'); })
        .then(function () { return client.dispatch('GetAccountInfo', {
        omsId: 0,
        accountId: 11
    }); })
        .then(function (s) { return console.log(s); })
        .then(function () { return client.kill(); })); }, 4e3)); })["catch"](console.error);
