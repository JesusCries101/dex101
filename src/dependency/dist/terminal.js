"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
exports.parse = (function (validators) { return ((function (argv) {
    if (argv === void 0) { argv = process.argv.slice(2); }
    if (argv.length % 2 != 0) {
        throw new Error('terminal::parse');
    }
    else {
        return (function (args) {
            for (var k in validators) {
                if (validators[k](args[k])) {
                }
                else {
                    throw new Error("terminal::parse::key " + k + " not validated");
                }
            }
            return args;
        })((function (key) {
            if (key === void 0) { key = ''; }
            return (argv
                .reduce(function (acc, arg, i) {
                var _a;
                return (i % 2 == 0 ? (key = arg, acc) : Object.assign(acc, (_a = {}, _a[key] = arg, _a)));
            }, {}));
        })());
    }
})()); });
