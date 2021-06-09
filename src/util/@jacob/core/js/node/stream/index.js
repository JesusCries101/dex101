"use strict";
exports.__esModule = true;
var promisify = (function (op) { return (function (rstream, wstream) { return (new Promise(function (resolve, reject) { return (op === 'pipe' ?
    rstream.pipe(wstream)
        .on('finish', resolve)
        .on('error', reject) :
    resolve()); })); }); });
exports.promisify = promisify;
