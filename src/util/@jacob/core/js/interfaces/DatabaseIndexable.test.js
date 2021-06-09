"use strict";
exports.__esModule = true;
var DatabaseIndexable_1 = require("./DatabaseIndexable");
var fs = require("fs");
var path = require("path");
var blobpathDatabase = path.join(process.cwd(), '__db.json');
var indexable = {
    getByKey: function (key) { return (Promise.resolve()
        .then(function () {
        try {
            return JSON.parse(fs.readFileSync(blobpathDatabase).toString());
        }
        catch (err) {
            return {};
        }
    })
        .then(function (json) { return json[key]; })); },
    setByKey: function (key) { return function (node) { return (Promise.resolve()
        .then(function () { return (fs.writeFileSync(blobpathDatabase, (function () {
        var json = (function () {
            try {
                return JSON.parse(fs.readFileSync(blobpathDatabase).toString());
            }
            catch (err) {
                return {};
            }
        })();
        json[key] != undefined ?
            json[key].push(node) :
            (json[key] = [node]);
        return JSON.stringify(json, null, 2);
    })())); })); }; },
    keys: {
        'a': function (node) { return node.a + "-" + node.c; },
        'b': function (node) { return node.b.join('-'); }
    },
    combineKeys: function (keys) { return function (node) { return (Object.keys(keys)
        .map(function (key) { return keys[key](node); })
        .join('-')); }; }
};
DatabaseIndexable_1["default"].dispatch(indexable)({
    a: 'lmao',
    b: ['0', '1'],
    c: 10
})
    .then(function () { return (DatabaseIndexable_1["default"].query(indexable)({
    a: 'lol',
    b: ['0', '1'],
    c: 10
})
    .then(console.log)); })["catch"](console.error);
