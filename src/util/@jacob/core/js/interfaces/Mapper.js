"use strict";
exports.__esModule = true;
var ramda_1 = require("../ramda");
var Mapper;
(function (Mapper) {
    Mapper.exec = (function (mapper) {
        var mapSrc2Dest = mapper.mapSrc2Dest;
        if (mapper.async) {
            var _a = mapper, readFrom_1 = _a.readFrom, writeTo_1 = _a.writeTo;
            return Object.keys(mapSrc2Dest)
                .map(function (src) { return function () { return (readFrom_1(src)
                .then(function (buf) { return writeTo_1(mapSrc2Dest[src])(buf); })); }; })
                .reduce(function (acc, val) { return acc.then(val); }, Promise.resolve());
        }
        else {
            var _b = mapper, readFrom_2 = _b.readFrom, writeTo_2 = _b.writeTo;
            return Object.keys(mapSrc2Dest)
                .forEach(function (src) { return (ramda_1.compose(writeTo_2(mapSrc2Dest[src]), readFrom_2)(src)); });
        }
    });
})(Mapper || (Mapper = {}));
exports.Mapper = Mapper;
exports["default"] = Mapper;
