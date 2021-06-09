"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var M = require("./Mixin");
var mixinFn = (function (base) { return (/** @class */ (function (_super) {
    __extends(_Mixin, _super);
    function _Mixin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return _Mixin;
}(base))); });
var EqFn = function (base) { return (/** @class */ (function (_super) {
    __extends(Eq, _super);
    function Eq() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Eq.prototype.equal = function (another) {
        return !this.notEqual(another);
    };
    Eq.prototype.notEqual = function (another) {
        return !this.equal(another);
    };
    return Eq;
}(base))); };
var Ordering;
(function (Ordering) {
    Ordering[Ordering["LT"] = 0] = "LT";
    Ordering[Ordering["EQ"] = 1] = "EQ";
    Ordering[Ordering["GT"] = 2] = "GT";
})(Ordering = exports.Ordering || (exports.Ordering = {}));
exports.OrdFn = function (base) { return (/** @class */ (function (_super) {
    __extends(Ord, _super);
    function Ord() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ord.prototype.lessOrEqual = function (another) {
        if (this.equal(another) || this.compare(another) === Ordering.LT)
            return true;
        return false;
    };
    Ord.prototype.compare = function (another) {
        if (this.equal(another))
            return Ordering.EQ;
        if (this.lessOrEqual(another))
            return Ordering.LT;
        else
            return Ordering.GT;
    };
    return Ord;
}(base))); };
var sort = function (array) {
    return array.slice().sort(function (a, b) {
        switch (a.compare(b)) {
            case Ordering.LT: return -1;
            case Ordering.EQ: return 0;
            case Ordering.GT: return 1;
        }
    });
};
var Person = /** @class */ (function (_super) {
    __extends(Person, _super);
    function Person(age) {
        var _this = _super.call(this) || this;
        _this.age = age;
        return _this;
    }
    Person.prototype.equal = function (another) {
        return this.age === another.age;
    };
    Person.prototype.lessOrEqual = function (another) {
        return this.age <= another.age;
    };
    return Person;
}(exports.OrdFn(EqFn(M.Base))));
var person1 = new Person(11);
var person2 = new Person(22);
var person3 = new Person(33);
var person4 = new Person(44);
var sorted = sort([person4, person2, person3, person1]);
console.log(sorted);
