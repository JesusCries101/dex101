"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseCapability = void 0;
var PromiseCapability = /** @class */ (function () {
    function PromiseCapability() {
        var _this = this;
        this.resolve = undefined;
        this.reject = undefined;
        this.promise = new Promise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        });
    }
    return PromiseCapability;
}());
exports.PromiseCapability = PromiseCapability;
exports.default = PromiseCapability;
