"use strict";
exports.__esModule = true;
var compose_1 = require("./compose");
function pipe() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return compose_1["default"].apply(void 0, fns.reverse());
}
exports["default"] = pipe;
