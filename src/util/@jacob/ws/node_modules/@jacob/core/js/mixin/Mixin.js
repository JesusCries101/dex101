"use strict";
exports.__esModule = true;
var T = require("../toolbelt");
var Base = /** @class */ (function () {
    function Base() {
    }
    Base.prototype.initialize = function (props) {
        props && T.Object.assign(this, props);
    };
    Base["new"] = function (props) {
        var instance = new this();
        instance.initialize(props);
        return instance;
    };
    return Base;
}());
exports.Base = Base;
