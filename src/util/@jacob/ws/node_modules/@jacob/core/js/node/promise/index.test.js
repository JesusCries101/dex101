"use strict";
exports.__esModule = true;
var _1 = require("./");
Promise.resolve({
    i: 0
})
    .then(function (_) { return (_1.loopify(function () { return _.i < 10; })(function () { return (Promise.resolve()
    .then(function () { return console.log(_.i++); })
    .then(function () { return 'done'; })); })); })
    .then(console.log)
    .then(function () { return _1.waitFor(3e3); })
    .then(function () { return (_1.statefulLoopify({
    j: 0
})(function (_) { return function () { return (_.j < 5); }; })(function (_) { return function () { return (_1.waitFor(1e3)
    .then(function () { return console.log(_.j++); })); }; })); })
    .then(function () { return console.log('end'); });
