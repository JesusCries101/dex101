"use strict";
exports.__esModule = true;
var _1 = require("./");
var ramda_1 = require("../../ramda");
[
    'node --version',
    'nodes --help'
]
    .map(function (cmd) { return (ramda_1.compose(_1.promisify, _1.makeSubprocess)(cmd)); })
    .reduce(function (acc, val) { return (acc.then(val).then(function (r) { return (console.log(r), r); })); }, Promise.resolve(''))["catch"](console.error);
