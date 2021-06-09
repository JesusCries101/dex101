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
var T = require("../../toolbelt");
var R = require("../../ramda");
var N = require("../../node");
var fs = require("fs");
var JsonBlob;
(function (JsonBlob) {
    JsonBlob.makeBridge = (function (config) { return (function (_) { return (__assign(__assign({}, T.json.pick(_, 'getKey')), { getTree: function () { return (R.pipe(function () { return (T.nullifyError(function () { return (R.compose(function (data) { return JSON.parse(data); }, function () { return fs.readFileSync(config.blobpath).toString(); })()); })()); }, function (tree) { return R.isNil(tree) ? {} : tree; })()); }, getByKey: function (key) {
            var _this = this;
            return R.pipe(function () { return T.Promise.resolve().then(function () { return _this.getTree(); }); }, R.then(function (tree) { return tree[key] || []; }))();
        }, setByKey: function (node) {
            var _this = this;
            return function (key) { return (R.pipe(function () { return T.Promise.resolve().then(function () { return _this.getTree(); }); }, R.then(function (tree) { return (R.pipe(function () { return T.initJson(tree, key)([]).push(node); }, function () { return N.fs.writeFileSync(config.blobpath, (JSON.stringify(tree, null, 2))); }, function () { return undefined; })()); }))()); };
        }, removeByKey: function (node) {
            var _this = this;
            return function (key) { return (R.pipe(function () { return T.Promise.resolve().then(function () { return _this.getTree(); }); }, R.then(function (tree) { return (R.pipe(function () { return T.initJson(tree, key)([]); }, function (nodes) { return R.compose(function (index) { return nodes.splice(index, 1); }, function (index) { return T.replace(index)()(-1, nodes.length); }, function () { return (N.array.flexibleIndexOf(nodes)(node, (T.JsonComparer.deepify(T.jsonComparer)(function (a, b) { return (R.isArray(a) && R.isArray(b) ?
                T.arrayComparer()(a, b) :
                T.defaultComparer()(a, b)); })))); })(); }, function () { return (N.fs.writeFileSync(config.blobpath, (JSON.stringify(tree, null, 2))),
                undefined); })()); }))()); };
        } })); }); });
})(JsonBlob || (JsonBlob = {}));
exports.JsonBlob = JsonBlob;
