"use strict";
exports.__esModule = true;
var T = require("../toolbelt");
var R = require("../ramda");
var Decimal;
(function (Decimal) {
    Decimal.isType = (function (val) { return (R.isString(val) &&
        val._type0 === 'decimal'); });
    Decimal.create = (function (str) {
        if (str.split('').every(function (e) { return !R.isNaN(T.parseInt(e)); }))
            return T.Object.assign(str, { _type0: T.string.create('decimal') });
        throw new Error('(str) invalid for Decimal');
    });
})(Decimal || (Decimal = {}));
exports.Decimal = Decimal;
exports["default"] = Decimal;
