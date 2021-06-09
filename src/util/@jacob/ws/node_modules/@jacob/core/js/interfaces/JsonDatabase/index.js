"use strict";
exports.__esModule = true;
var R = require("../../ramda");
var _bridge = require("./bridge");
var JsonDatabase;
(function (JsonDatabase) {
    JsonDatabase.push = (function (db) { return (function (node) { return (Promise.resolve()
        .then(R.pipe(function () { return db.getKey(node); }, function (key) { return Promise.resolve().then(function () { return key; }); }, R.then(function (key) { return (db.setByKey(node)(key)); })))); }); });
    JsonDatabase.remove = (function (db) { return (function (node) { return (Promise.resolve()
        .then(R.pipe(function () { return db.getKey(node); }, function (key) { return Promise.resolve().then(function () { return key; }); }, R.then(function (key) { return (db.removeByKey(node)(key)); })))); }); });
    JsonDatabase.getByKey = (function (db) { return (function (key) { return (Promise.resolve().then(function () { return db.getByKey(key); })); }); });
    JsonDatabase.bridge = _bridge;
})(JsonDatabase || (JsonDatabase = {}));
exports.JsonDatabase = JsonDatabase;
exports["default"] = JsonDatabase;
