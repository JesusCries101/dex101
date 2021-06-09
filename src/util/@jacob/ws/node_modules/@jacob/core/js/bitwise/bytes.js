"use strict";
exports.__esModule = true;
var T = require("../toolbelt");
var hex_1 = require("./hex");
var Bytes20;
(function (Bytes20) {
    Bytes20.isType = (function (val) { return (hex_1["default"].isType(val) &&
        val._type1 === 'bytes20'); });
    Bytes20.create = (function (val) {
        var hex = hex_1["default"].create(val);
        if (hex.replace(/^0x/, '').length == 40)
            return T.Object.assign(hex, { _type1: T.string.create('bytes20') });
        throw new Error('(str) invalid for Bytes20');
    });
    Bytes20.toBytes32 = (function (bytes20) { return ((function (hex) { return (Bytes32.create(hex)); })(hex_1["default"].pad(hex_1["default"].Pad.Direction.Left, 24)(bytes20))); });
})(Bytes20 || (Bytes20 = {}));
exports.Bytes20 = Bytes20;
var Bytes32;
(function (Bytes32) {
    Bytes32.isType = (function (val) { return (hex_1["default"].isType(val) &&
        val._type1 === 'bytes32'); });
    Bytes32.create = (function (val) {
        var hex = hex_1["default"].create(val);
        if (hex.replace(/^0x/, '').length == 64)
            return T.Object.assign(hex, { _type1: T.string.create('bytes32') });
        throw new Error('(str) invalid for Bytes32');
    });
    Bytes32.toBytes20 = (function (bytes32) { return ((function (hex) { return (Bytes20.create(hex)); })(hex_1["default"].truncate(hex_1["default"].Truncate.Direction.Left, 24)(bytes32))); });
})(Bytes32 || (Bytes32 = {}));
exports.Bytes32 = Bytes32;
