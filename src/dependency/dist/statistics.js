"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOutliers_ = exports.removeOutliers = exports.standardDeviation = exports.mean = void 0;
var mean = function (list) { return (list.reduce(function (acc, v) { return acc + v; }, 0) / list.length); };
exports.mean = mean;
var standardDeviation = function (list) { return ((function (mean) { return ((function (acc) {
    if (acc === void 0) { acc = list.reduce(function (acc, v) { return acc + Math.pow(v - mean, 2); }, 0); }
    return (Math.pow(acc / list.length, 0.5));
})()); })(exports.mean(list))); };
exports.standardDeviation = standardDeviation;
var removeOutliers = function (threshold) { return function (list) { return ((function (mean, std) { return (list.reduceRight(function (acc, v, i) { return (threshold < Math.abs(v - mean) / std ? (list.splice(i, 1), acc.push(v), acc) : acc); }, [])); })(exports.mean(list), exports.standardDeviation(list))); }; };
exports.removeOutliers = removeOutliers;
var removeOutliers_ = function (threshold) { return (function (list, morphism) { return ((function (list_) {
    if (list_ === void 0) { list_ = list.map(morphism); }
    return ((function (mean, std) { return (list.reduceRight(function (acc, v, i) { return (threshold < Math.abs(morphism(v) - mean) / std ? (list.splice(i, 1), acc.push(v), acc) : acc); }, [])); })(exports.mean(list_), exports.standardDeviation(list_)));
})()); }); };
exports.removeOutliers_ = removeOutliers_;
