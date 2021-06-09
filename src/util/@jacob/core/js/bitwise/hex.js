"use strict";
exports.__esModule = true;
var T = require("../toolbelt");
var R = require("../ramda");
var decimal_1 = require("./decimal");
var math_1 = require("../math");
var Hex;
(function (Hex) {
    Hex.isType = (function (val) { return (R.isString(val) &&
        val._type0 === 'hex'); });
    Hex.create = (function (str) {
        str = str.replace(/^0x/, '');
        if (str.split('').every(function (e) { return !R.isNaN(T.parseInt(e, 16)); }))
            return T.Object.assign("0x" + str, { _type0: T.string.create('hex') });
        throw new Error('(str) invalid for Hex');
    });
    Hex.pad = (function (dir, n) { return (function (hex) { return ((function (hex) { return ((function (hexTail) { return Hex.create(hexTail); })((function (padStr) { return (dir === Pad.Direction.Left ? "" + padStr + hex : "" + hex + padStr); })(T.Array.apply(T, T.Array(n)).map(function () { return '0'; }).join('')))); })(hex.replace(/^0x/, ''))); }); });
    var Pad;
    (function (Pad) {
        var Direction;
        (function (Direction) {
            Direction[Direction["Left"] = 0] = "Left";
            Direction[Direction["Right"] = 1] = "Right";
        })(Direction = Pad.Direction || (Pad.Direction = {}));
    })(Pad = Hex.Pad || (Hex.Pad = {}));
    Hex.truncate = (function (dir, n) { return (function (hex) { return ((function (hexTail) { return Hex.create(hexTail); })((function (hexSeq) { return (dir === Truncate.Direction.Left ?
        hexSeq.slice(R.min(n, hexSeq.length - 1)).join('') :
        hexSeq.slice(0, R.max(hexSeq.length - n, 1)).join('')); })(hex.replace(/^0x/, '').split('')))); }); });
    var Truncate;
    (function (Truncate) {
        var Direction;
        (function (Direction) {
            Direction[Direction["Left"] = 0] = "Left";
            Direction[Direction["Right"] = 1] = "Right";
        })(Direction = Truncate.Direction || (Truncate.Direction = {}));
    })(Truncate = Hex.Truncate || (Hex.Truncate = {}));
    Hex.toDecimal = (function (hex) { return ((function (number) { return decimal_1["default"].create(number.toString()); })(hex.replace(/^0x/, '').split('')
        .map(function (digit) { return T.parseInt(digit, 16); })
        .map(function (digit, i, array) { return digit * math_1.Math.pow(16, array.length - 1 - i); })
        .reduce(function (acc, val) { return acc + val; }, 0))); });
})(Hex || (Hex = {}));
exports.Hex = Hex;
exports["default"] = Hex;
