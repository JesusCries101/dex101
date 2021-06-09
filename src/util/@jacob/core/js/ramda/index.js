"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
var compose_1 = require("./compose");
exports.compose = compose_1["default"];
var pipe_1 = require("./pipe");
exports.pipe = pipe_1["default"];
__export(require("./merge"));
__export(require("./deepMerge"));
__export(require("./util"));
