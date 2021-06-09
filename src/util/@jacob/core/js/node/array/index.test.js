"use strict";
exports.__esModule = true;
var _1 = require("./");
var array = Array.apply(void 0, Array(10)).map(function (e, i) { return i + 1; });
var filtered = (_1.mutativeFilter(array)(function (val) { return val % 2 != 0; }));
console.log(array);
console.log(filtered);
