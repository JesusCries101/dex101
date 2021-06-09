"use strict";
var _a;
exports.__esModule = true;
var Mapper_1 = require("./Mapper");
Mapper_1.Mapper.exec({
    async: true,
    mapSrc2Dest: (_a = {},
        _a['src0'] = 'dest0',
        _a['src1'] = 'dest1',
        _a),
    readFrom: function (src) { return Promise.resolve(src + "-"); },
    writeTo: function (dest) { return function (buf) { return (Promise.resolve("" + buf + dest)
        .then(console.log)); }; }
})
    .then(function () { return console.log('end'); });
