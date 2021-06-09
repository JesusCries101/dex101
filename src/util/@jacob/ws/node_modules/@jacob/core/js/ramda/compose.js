"use strict";
exports.__esModule = true;
function compose() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return (fns.length == 0 ?
        function (arg) { return arg; } :
        fns.length == 1 ?
            fns[0] :
            fns.reduceRight(function (acc, val) { return (function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return val(acc.apply(void 0, args));
            }); }));
}
exports["default"] = compose;
