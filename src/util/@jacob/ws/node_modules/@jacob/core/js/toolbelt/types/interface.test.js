"use strict";
exports.__esModule = true;
var T = require("../../toolbelt");
console.log(T.JsonTransform.deepify(T.json.remove)({
    a: 1,
    type: '',
    b: {
        type: 'e',
        types: 1
    }
}, 'a'));
