"use strict";
exports.__esModule = true;
var ramda_1 = require("../ramda");
var Counter = /** @class */ (function () {
    function Counter(config) {
        this.config = ramda_1.deepMerge(function (k, l, r) { return r; })({
            step: 1,
            rep: 1
        }, config);
        this._ = {
            i: 0
        };
    }
    Counter.prototype.current = function () {
        var _a = this, _ = _a._, config = _a.config;
        return config.init + config.step * Math.floor(_.i / config.rep);
    };
    Counter.prototype.next = function () {
        this.advance();
        return this.current();
    };
    Counter.prototype.prev = function () {
        this.reverse();
        return this.current();
    };
    Counter.prototype.index = function () {
        return this._.i;
    };
    Counter.prototype.advanceable = function () {
        var _a = this, _ = _a._, config = _a.config;
        return !(Math.floor((config.lim - config.init) / config.step) < Math.floor((_.i + 1) / config.rep));
    };
    Counter.prototype.reversible = function () {
        var _ = this._;
        return 0 < _.i;
    };
    Counter.prototype.advance = function () {
        var _ = this._;
        return this.advanceable() && (++_.i, true);
    };
    Counter.prototype.reverse = function () {
        var _ = this._;
        return this.reversible() && (--_.i, true);
    };
    return Counter;
}());
exports.Counter = Counter;
exports["default"] = Counter;
