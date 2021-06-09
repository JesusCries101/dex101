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
var __1 = require("..");
var core_1 = require("@jacob/core");
core_1.toolbelt.Promise.resolve({
    client: core_1.toolbelt.nullifyError(function () { return (new __1["default"]({
        address: 'ws://127.0.0.1:8080/',
        reqActionToData: function (action) {
            var _a;
            return (JSON.stringify((_a = {},
                _a['m'] = 0,
                _a['i'] = 0,
                _a['n'] = action.type,
                _a['o'] = JSON.stringify(action.payload),
                _a)));
        },
        dataToResAction: function (data) { return (console.log(data),
            Promise.resolve({
                json: (core_1.toolbelt.nullifyError(function () { return JSON.parse(data); })() || {})
            })
                .then(function (_) { return (__assign(__assign({}, _), { type: _.json['n'] })); })
                .then(function (_) { return (__assign(__assign({}, _), { payload: (_.type === 'AuthenticateUser' ? (core_1.toolbelt.nullifyError(function () { return (core_1.toolbelt.json.pick(JSON.parse(_.json['o']), 'Authenticated', 'errormsg')); })()) : null) })); })
                .then(function (_) { return (core_1.ramda.isNil(_.type) || core_1.ramda.isNil(_.payload) ?
                core_1.toolbelt.Promise.reject(new Error('data cannot be parsed')) : core_1.toolbelt.json.pick(_, 'type', 'payload')); })["catch"](function (err) { return (console.error(err),
                core_1.toolbelt.Promise.reject(err)); })); }
    })); })()
})
    .then(function (_) { return (core_1.ramda.isNil(_.client) ?
    undefined : (core_1.toolbelt.Promise.resolve(_.client)
    .then(function (client) { return client.start(); })
    .then(function (client) { return ([
    function () { return (client.dispatch(client.makeAction('AuthenticateUser', {
        'UserName': 's',
        'Password': ''
    }))); }
]
    .reduce(function (acc, val) { return acc.then(val); }, core_1.toolbelt.Promise.resolve())["catch"](console.error)
    .then(function () { return client.kill(); })); })
    .then(function () { return undefined; }))); })["catch"](console.error);
