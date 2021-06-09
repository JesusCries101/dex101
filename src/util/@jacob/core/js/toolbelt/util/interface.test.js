"use strict";
exports.__esModule = true;
var I = require("./interface");
var R = require("../../ramda");
Promise.resolve()
    .then(function () { return ({
    comparer: (I.JsonComparer.deepify(I.jsonComparer)(function (a, b) { return (R.isArray(a) && R.isArray(b) ? (a.length == b.length && a.every(function (e, i) { return e === b[i]; }) ? 0 : 1) :
        I.defaultComparer()(a, b)); })),
    json0: {
        a: 5,
        b: {
            a: 10,
            c: ['s', 'a'],
            d: ['s'],
            e: {
                a: [1, 's']
            }
        }
    },
    json1: {
        a: 5,
        b: {
            a: 10,
            c: ['s', 'a'],
            d: ['s'],
            e: {
                a: [1, 's']
            }
        }
    }
}); })
    .then(function (g) { return (g.comparer(g.json0, g.json1)); })
    .then(console.log);
