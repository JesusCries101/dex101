"use strict";
exports.__esModule = true;
var A = require("./patch");
var T = require("../../toolbelt");
T.Promise.resolve({
    thunks: [
        function () { return (A.string.split({
            trDelim: function (a) { return "(" + a + ")"; },
            once: false,
            arrayDelim: ['S', '1', 'e']
        })('edwS1efvS1')); }
    ]
})
    .then(function (g) { return g.thunks[0](); })
    .then(console.log);
