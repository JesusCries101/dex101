"use strict";
exports.__esModule = true;
var index_1 = require("./index");
var T = require("../../toolbelt");
T.Promise.resolve({
    thunks: [
        function () { return (index_1.replace({
            once: false,
            replacers: {
                'a': '(a)',
                'b': '(C)'
            }
        })('afew2badfadd')); }
    ]
})
    .then(function (g) { return g.thunks[0](); })
    .then(console.log);
