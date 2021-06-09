"use strict";
exports.__esModule = true;
var bytes_1 = require("./bytes");
var T = require("../toolbelt");
T.Promise.resolve({
    thunks: [
        function () { return bytes_1.Bytes32.toBytes20(bytes_1.Bytes32.create('0x000000000000000000000000c4777287ddceb283ed6db59c88db5074f1b25e4e')); },
        function () { return bytes_1.Bytes20.toBytes32(bytes_1.Bytes20.create('0xc4777287ddceb283ed6db59c88db5074f1b25e4e')); }
    ]
})
    .then(function (g) { return g.thunks[1](); })
    .then(console.log);
