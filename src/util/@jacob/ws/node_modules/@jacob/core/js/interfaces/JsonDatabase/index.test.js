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
var _1 = require(".");
var T = require("../../toolbelt");
var R = require("../../ramda");
var path = require("path");
Promise.resolve()
    .then(function () { return ({
    blobpathDb: path.join(process.cwd(), '__tmp/db.json')
}); })
    .then(function (g) { return (__assign(__assign({}, g), { db: _1["default"].bridge.JsonBlob.makeBridge({
        blobpath: g.blobpathDb
    })({
        getKey: function (node) { return node.type + "-" + node.id; }
    }) })); })
    .then(function (g) { return (Promise.resolve()
    .then(function () { return ({
    push: _1["default"].push(g.db),
    remove: _1["default"].remove(g.db),
    getByKey: _1["default"].getByKey(g.db)
}); })
    .then(function (_) { return [
    function () { return (T.Promise.resolve()
        .then(function () { return _.push({
        type: 'type0',
        id: 1,
        payload: {
            a: 'shit',
            b: [1, 2, 3]
        }
    }); })
        .then(function () { return _.push({
        type: 'type0',
        id: 1,
        payload: {
            a: 'coin',
            b: [3, 2, 1]
        }
    }); })); },
    R.pipe(function () { return _.remove({
        type: 'type0',
        id: 1,
        payload: {
            a: 'shit',
            b: [1, 2, 3]
        }
    }); }),
    R.pipe(function () { return Promise.resolve(_.getByKey('type0-1')); }, R.then(console.log))
]; })
    .then(function (thunks) { return thunks[2](); })); });
