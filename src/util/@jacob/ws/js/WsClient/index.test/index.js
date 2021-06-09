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
        address: 'ws://127.0.0.1:7650/',
        reduceReqAction: function (action) {
            var _a;
            return (JSON.stringify((_a = {},
                _a['m'] = 0,
                _a['i'] = 0,
                _a['n'] = action.type,
                _a['o'] = JSON.stringify(action.payload),
                _a)));
        },
        extractResAction: function (data) { return (console.log(data),
            Promise.resolve({
                json: (core_1.toolbelt.nullifyError(function () { return JSON.parse(data); })() || {})
            })
                .then(function (_) { return (__assign(__assign({}, _), { type: _.json['n'] })); })
                .then(function (_) { return (__assign(__assign({}, _), { payload: (_.type === 'AuthenticateUser' ? (core_1.toolbelt.nullifyError(function () { return (core_1.toolbelt.json.pick(JSON.parse(_.json['o']), 'Authenticated', 'User', 'errormsg')); })()) :
                    _.type === 'RegisterNewUser' ? (core_1.toolbelt.nullifyError(function () { return (core_1.toolbelt.json.pick(JSON.parse(_.json['o']), 'UserId', 'errormsg')); })()) :
                        _.type === 'GetUserAccountInfos1' ? (core_1.toolbelt.nullifyError(function () { return JSON.parse(_.json['o']); })()) : null) })); })
                .then(function (_) { return (core_1.ramda.isNil(_.type) || core_1.ramda.isNil(_.payload) ?
                core_1.toolbelt.Promise.reject(new Error('data cannot be parsed')) : core_1.toolbelt.json.pick(_, 'type', 'payload')); })["catch"](function (err) { return (console.error(err),
                core_1.toolbelt.Promise.reject(err)); })); }
    })); })()
})
    .then(function (_) { return (core_1.ramda.isNil(_.client) ?
    undefined : (core_1.toolbelt.Promise.resolve(_.client)
    .then(function (client) { return client.start(); })
    /*
    .then(client => (
      ([
        () => (
          client.dispatch(client.makeAction('AuthenticateUser', {
            'UserName': 'JacobTheProgrammer',
            'Password': 'Password123'
          })),
          client.dispatch(client.makeAction('AuthenticateUser', {
            'UserName': 'JacobTheProgrammer',
            'Password': 'Password123'
          }))
            .then(resAction => (
              T.Promise.resolve()
                .then(() => JSON.stringify(resAction, null, 2))
                .then(console.log)
                .then(() => (
                  !resAction.payload || resAction.payload.error ?
                  undefined as void : (
                    client.dispatch(client.makeAction('GetUserAccountInfos1', {
                      ...T.json.pick(resAction.payload['User'], 'OMSId', 'UserId', 'UserName')
                    }))
                      .then(resAction => JSON.stringify(resAction, null, 2))
                      .then(console.log)
                  )
                ))
            ))
        ),
        () => (
          client.dispatch(client.makeAction('AuthenticateUser', {
            'UserName': 'JacobTheProgrammer',
            'Password': 'Password123'
          })),
          client
            .dispatch(client.makeAction('RegisterNewUser', {
              'UserInfo': {
                'Email': 'eddiethebeasthall.0@gmail.com',
                'UserName': 'EddieHall',
                'passwordHash': 'Password123'
              },
              'UserConfig': [{
                'Name': 'fullName',
                'Value': 'Eddie Hall'
              }],
              'OperatorId': 1
            }))
            .then(resAction => JSON.stringify(resAction, null, 2))
            .then(console.log)
        )
      ] as T.Thunk<T.Promisable<void>>[])
        .reduce((acc, val) => acc.then(val), T.Promise.resolve())
        .catch(console.error)
        .then(() => client.kill())
    ))
    */
    .then(function () { return undefined; }))); });
