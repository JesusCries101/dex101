"use strict";
exports.__esModule = true;
var trampoline = (function (fn) { return (function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var state = fn.apply(null, args);
    while (Trampoline.isBounce(state))
        state = fn.apply(null, state.args);
    return state.ret;
}); });
exports.trampoline = trampoline;
var Trampoline;
(function (Trampoline) {
    Trampoline.bounce = (function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return ({
            recur: true,
            args: args
        });
    });
    Trampoline.crack = (function (ret) { return ({
        recur: false,
        ret: ret
    }); });
    Trampoline.isCrack = (function (state) { return (!state.recur); });
    Trampoline.isBounce = (function (state) { return (state.recur); });
    Trampoline.combine = (function () {
        var states = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            states[_i] = arguments[_i];
        }
        return (function (combiner) { return (states[0].recur ? (states[1].recur ? (Trampoline.bounce(states[0].args[0].concat(states[1].args[0]), states[0].args[1].concat(states[1].args[1]))) : (Trampoline.bounce(states[0].args[0], combiner(states[0].args[1], states[1].ret)))) : (states[1].recur ? (Trampoline.bounce(states[1].args[0], combiner(states[0].ret, states[1].args[1]))) : (Trampoline.crack(combiner(states[0].ret, states[1].ret))))); });
    });
})(Trampoline || (Trampoline = {}));
exports.Trampoline = Trampoline;
exports["default"] = trampoline;
