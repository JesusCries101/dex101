"use strict";
exports.__esModule = true;
var deepMerge_1 = require("./deepMerge");
Promise.resolve()
    .then(function () { return (deepMerge_1["default"](function (k, l, r) { return (Array.isArray(l) && Array.isArray(r) ? l.concat(r) : r); })({
    a: 1,
    b: {
        c: [1, 2]
    },
    c: 'lmao'
}, {
    a: 2,
    b: {
        c: [3, 4]
    },
    d: 'lol'
})); })
    .then(console.log);
