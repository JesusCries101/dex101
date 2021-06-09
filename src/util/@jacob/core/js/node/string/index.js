"use strict";
exports.__esModule = true;
var A = require("../array");
var T = require("../../toolbelt");
var replace = (function (config) { return (function (str) { return (A.string.split({
    trDelim: function (delim) { return config.replacers[delim]; },
    once: config.once,
    arrayDelim: T.Object.keys(config.replacers)
})(str)
    .join('')); }); });
exports.replace = replace;
