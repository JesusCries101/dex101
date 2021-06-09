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
    server: new __1["default"]({
        port: 7650,
        dataToReqAction: function (data) { return (core_1.toolbelt.Promise.resolve()
            .then(function () { return (core_1.toolbelt.nullifyError(function () {
            var json = JSON.parse(data);
            return {
                type: json['n'],
                payload: JSON.parse(json['o'])
            };
        })()); })
            .then(function (reqAction) { return (core_1.ramda.isNil(reqAction) ?
            core_1.toolbelt.Promise.reject(new core_1.toolbelt.Error('invalid payload')) :
            reqAction); })); },
        reqActionToResAction: function (reqAction) { return (console.log(reqAction),
            reqAction.type === 'AuthenticateUser' ? (reqAction.payload['UserName'] === '' && reqAction.payload['Password'] === '' ? ({
                type: 'AuthenticateUser',
                payload: {
                    error: false,
                    Authenticated: true
                }
            }) : ({
                type: 'AuthenticateUser',
                payload: {
                    error: true,
                    errormsg: 'invalid credentials'
                }
            })) : undefined); },
        resActionToData: function (resAction) {
            var _a;
            return (JSON.stringify((_a = {},
                _a['m'] = 0,
                _a['i'] = 0,
                _a['n'] = resAction.type,
                _a['o'] = JSON.stringify(resAction.payload),
                _a)));
        }
    })
})
    .then(function (_) { return (_.server.start()
    .then(function (server) { return (__assign(__assign({}, _), { server: server })); })); });
