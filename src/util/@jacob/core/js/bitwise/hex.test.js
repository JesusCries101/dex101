"use strict";
exports.__esModule = true;
var hex_1 = require("./hex");
var T = require("../toolbelt");
T.Promise.resolve({
    thunks: [
        function () { return hex_1.Hex.pad(hex_1.Hex.Pad.Direction.Right, 3)(hex_1.Hex.create('a314')); },
        function () { return hex_1.Hex.truncate(hex_1.Hex.Truncate.Direction.Right, 3)(hex_1.Hex.create('0x341')); },
        function () { return hex_1.Hex.toDecimal(hex_1.Hex.create('0xa1')); }
    ]
})
    .then(function (g) { return (g.thunks[2]()); })
    .then(console.log)["catch"](console.error);
