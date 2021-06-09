"use strict";
exports.__esModule = true;
var _1 = require("./");
var picked = (_1.pickJson({
    a: 1,
    b: 'lol',
    c: [1, 'test']
}, 'a', 'c', 'a'));
console.log(picked);
console.log(_1.arrayifyJson(picked, function (key, json) { return (json[key]); }));
var a = {};
var b = a;
var leafified = (_1.json.fullLeafify({
    a: '',
    b: {
        c: [1],
        d: {
            e: {
                lol: 'lol',
                lmao: ['lmao']
            }
        }
    }
}) //, (val): val is string[] => R.isArray(val) && val.every(e => typeof e === 'string'))
);
console.log(leafified);
_1.json.unpromisify({
    a: Promise.resolve(32),
    b: Promise.resolve([1])
})
    .then(function (a) { return console.log(a); });
