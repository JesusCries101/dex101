"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_ = exports.get = void 0;
var terminal = require("./terminal");
var get = function (key, filter) {
    if (filter === void 0) { filter = function (val) { return val; }; }
    var val = process.env[key];
    if (typeof val === 'undefined') {
        throw new Error("key [" + key + "] not defined in .env");
    }
    try {
        return filter(val);
    }
    catch (err) {
        throw new Error("filter for key [" + key + "] in .env not valid");
    }
};
exports.get = get;
var get_ = function (validators) { return ((function (args) {
    if (args === void 0) { args = terminal.parse(validators); }
    return ((function (key, filter) {
        if (filter === void 0) { filter = function (val) { return val; }; }
        if (key in args) {
            return filter(args[key]);
        }
        else {
            var val = process.env[key];
            if (typeof val === 'undefined') {
                throw new Error("key [" + key + "] not defined in .env");
            }
            try {
                return filter(val);
            }
            catch (err) {
                throw new Error("filter for key [" + key + "] in .env not valid");
            }
        }
    }));
})()); };
exports.get_ = get_;
