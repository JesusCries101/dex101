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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
__export(require("./types"));
__export(require("./util"));
var node_1 = require("../node");
var uniquify = node_1.array.uniquify;
var T = require("./types");
var R = require("../ramda");
var interface_1 = require("./util/interface");
var pickJson = (function (json) {
    var keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keys[_i - 1] = arguments[_i];
    }
    return uniquify(keys)()
        .map(function (key) {
        var _a;
        return (_a = {}, _a[key] = json[key], _a);
    })
        .reduce(function (acc, val) { return Object.assign(acc, val); }, {});
});
exports.pickJson = pickJson;
var arrayifyJson = (function (json, mapper) { return (Object.keys(json)
    .map(function (key, i, array) { return mapper(key, json, i, array.length); })); });
exports.arrayifyJson = arrayifyJson;
var monoTuple = (function (val, length) { return Array.apply(void 0, Array(length)).map(function () { return val; }); });
exports.monoTuple = monoTuple;
var nullifyError = (function (thunk) { return (function () {
    try {
        return thunk();
    }
    catch (err) {
        return null;
    }
}); });
exports.nullifyError = nullifyError;
var initJson = (function (json, key) { return (function (defVal) { return (R.isNil(json[key]) ? (json[key] = defVal) : json[key]); }); });
exports.initJson = initJson;
var replace = (function (arg) { return (function (comparer) {
    if (comparer === void 0) { comparer = interface_1.defaultComparer(); }
    return (R.isNumber(arg) && (comparer = interface_1.numberComparer()),
        function (from, to) { return (comparer(arg, from) != 0 ? arg : to); });
}); });
exports.replace = replace;
var mapJson = (function (json, mapper) { return arrayifyJson(json, function (key, json, i, n) {
    var _a;
    return (_a = {},
        _a[key] = mapper(key, json, i, n),
        _a);
})
    .reduce(function (acc, val) { return Object.assign(acc, val); }, {}); });
exports.mapJson = mapJson;
var MapJson;
(function (MapJson) {
})(MapJson || (MapJson = {}));
exports.MapJson = MapJson;
var removeJson = (function (json) {
    var keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keys[_i - 1] = arguments[_i];
    }
    return arrayifyJson(json, function (key, json) {
        var _a;
        return (keys.some(function (e) { return e === key; }) ? {} : (_a = {}, _a[key] = json[key], _a));
    })
        .reduce(function (acc, val) { return T.Object.assign(acc, val); }, {});
});
exports.removeJson = removeJson;
var leafifyJson = Object.assign((function (json, isLeafNode) { return arrayifyJson(json, function (key, json) {
    var val = json[key];
    return (R.isNil(isLeafNode) ? (R.isJson(val) ?
        leafifyJson(val, isLeafNode) :
        [val]) : (isLeafNode(val) ?
        [val] : (R.isJson(val) ?
        leafifyJson(val, isLeafNode) :
        [])));
})
    .reduce(function (acc, val) { return acc.concat(val); }, []); }), {
    trampolined: null /*trampoline(
      <TJson extends T.Record, TLeafNode>(json: TJson, isLeafNode?: (val: any) => val is TLeafNode, acc: (T.JsonLeafNode<TJson> | TLeafNode)[] = []) => (
        arrayifyJson(json, (key, json) => {
          let val = json[key];
          return (
            R.isNil(isLeafNode) ? (
              R.isJson(val) ?
              Trampoline.bounce.apply(null, [val, isLeafNode] as [typeof json, typeof isLeafNode]) :
              Trampoline.crack([val] as typeof acc)
            ) : (
              isLeafNode(val) ?
              Trampoline.crack([val] as typeof acc) : (
                R.isJson(val) ?
                Trampoline.bounce.apply(null, [val, isLeafNode] as [typeof json, typeof isLeafNode]) :
                Trampoline.crack([] as typeof acc)
              )
            )
          );
        })
          .reduce((acc0, val0) => (
            Trampoline.combine((...rets: any[][]) => (
              rets.reduce((acc, val) => acc.concat(val), [])
            ))(acc0, val0)
          ), Trampoline.crack(acc)) as any
      )
    )*/
});
exports.leafifyJson = leafifyJson;
var json;
(function (json_1) {
    json_1.pick = pickJson;
    json_1.arrayify = arrayifyJson;
    json_1.map = mapJson;
    json_1.init = initJson;
    json_1.remove = removeJson;
    json_1.leafify = leafifyJson;
    json_1.length = (function (json) { return T.Object.keys(json).length; });
    json_1.fullLeafify = (function (json, isLeaf) { return arrayifyJson(json, function (key, json) {
        var val = json[key];
        return (R.isNil(isLeaf) ? (R.isJson(val) ?
            json_1.fullLeafify(val, isLeaf).map(function (leaf) { return (__assign(__assign({}, leaf), { keys: [key].concat(leaf.keys) })); }) :
            [{ val: val, keys: [key] }]) : (isLeaf(val) ?
            [{ val: val, keys: [key] }] : (R.isJson(val) ?
            json_1.fullLeafify(val, isLeaf).map(function (leaf) { return (__assign(__assign({}, leaf), { keys: [key].concat(leaf.keys) })); }) :
            [])));
    })
        .reduce(function (acc, val) { return acc.concat(val); }, []); });
    json_1.copy = (function (json) { return json_1.map(json, function (key, json) { return json[key]; }); });
    json_1.unpromisify = (function (promisified) { return (json_1.arrayify(promisified, function (key, json) { return ({ key: key, val: json[key] }); })
        .reduce(function (acc, val) { return (acc.then(function (acc) { return val.val.then(function (_val) { return acc.concat([{ key: val.key, val: _val }]); }); })); }, T.Promise.resolve([]))
        .then(function (arrayResolved) { return (arrayResolved
        .reduce(function (acc, val) {
        var _a;
        return (T.Object.assign(acc, (_a = {}, _a[val.key] = val.val, _a)));
    }, {})); })); });
})(json || (json = {}));
exports.json = json;
var string;
(function (string) {
    string.create = (function (val) { return val; });
})(string || (string = {}));
exports.string = string;
