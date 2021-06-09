"use strict";
exports.__esModule = true;
var ramda_1 = require("../ramda");
var DatabaseIndexable;
(function (DatabaseIndexable) {
    DatabaseIndexable.query = (function (indexable) { return (function (node) { return (Promise.resolve(node)
        .then(ramda_1.compose(indexable.getByKey, indexable.combineKeys(indexable.keys)))); }); });
    DatabaseIndexable.dispatch = (function (indexable) { return (function (node) { return (Promise.resolve()
        .then(function () { return (ramda_1.compose(indexable.setByKey, indexable.combineKeys(indexable.keys))(node)(node)); })); }); });
})(DatabaseIndexable || (DatabaseIndexable = {}));
exports.DatabaseIndexable = DatabaseIndexable;
exports["default"] = DatabaseIndexable;
