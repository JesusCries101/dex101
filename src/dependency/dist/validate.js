"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disjunction = exports.Function = exports.Json = exports.Array = exports.SNumber = exports.Int = exports.Number = exports.String = exports.Boolean = exports.denullifyValidator = exports.nullifyValidator = exports.undefinedifyValidator = exports.validate = void 0;
var validate = function (validators) { return function (val) {
    if (Json.Validator(validators) && Json.Validator(val)) {
        for (var key in validators) {
            exports.validate(validators[key])(val[key]);
        }
    }
    else if (Array.Validator(validators) && Array.Validator(val)) {
        validators
            .forEach(function (validator, i) {
            if (i < val.length) {
                exports.validate(validator)(val[i]);
            }
            else {
                throw new Error('validate');
            }
        });
        for (var j = validators.length, i = j; i < val.length; i++) {
            exports.validate(validators[j - 1])(val[i]);
        }
    }
    else if (Function.Validator(validators)) {
        if (!validators(val)) {
            throw new Error('validate');
        }
    }
    else {
        throw new Error('validate');
    }
    return val;
}; };
exports.validate = validate;
var undefinedifyValidator = function (validator) { return (function (val) { return typeof val === 'undefined' || validator(val); }); };
exports.undefinedifyValidator = undefinedifyValidator;
var nullifyValidator = function (validator) { return (function (val) { return val === null || validator(val); }); };
exports.nullifyValidator = nullifyValidator;
var denullifyValidator = function (validator) { return (function (val) { return val !== null && validator(val); }); };
exports.denullifyValidator = denullifyValidator;
var Boolean;
(function (Boolean) {
    Boolean.Validator = (function (val) { return typeof val === 'boolean'; });
})(Boolean = exports.Boolean || (exports.Boolean = {}));
var String;
(function (String) {
    String.Validator = (function (val) { return typeof val === 'string'; });
})(String = exports.String || (exports.String = {}));
var Number;
(function (Number) {
    Number.Validator = (function (val) { return typeof val === 'number'; });
})(Number = exports.Number || (exports.Number = {}));
var Int;
(function (Int) {
    Int.Validator = (function (val) { return Number.Validator(val) && Math.ceil(val) == val; });
})(Int = exports.Int || (exports.Int = {}));
var SNumber;
(function (SNumber) {
    SNumber.Validator = (function (val) { return String.Validator(val) && !isNaN(parseFloat(val)); });
})(SNumber = exports.SNumber || (exports.SNumber = {}));
var Array;
(function (Array) {
    Array.Validator = (function (val) { return globalThis.Array.isArray(val); });
})(Array = exports.Array || (exports.Array = {}));
var Json;
(function (Json) {
    Json.Validator = (function (val) { return typeof val === 'object' && !Array.Validator(val); });
})(Json = exports.Json || (exports.Json = {}));
;
var Function;
(function (Function) {
    Function.Validator = (function (val) { return typeof val === 'function'; });
})(Function = exports.Function || (exports.Function = {}));
var Disjunction;
(function (Disjunction) {
    Disjunction.Validator = function () {
        var vals = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            vals[_i] = arguments[_i];
        }
        return (function (val) { return vals.some(function (_) { return _ === val; }); });
    };
})(Disjunction = exports.Disjunction || (exports.Disjunction = {}));
