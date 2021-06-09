"use strict";
exports.__esModule = true;
var child_process_1 = require("child_process");
var promise_1 = require("../promise");
var promisify = (function (subprocess) { return (function (stdinData) { return (new Promise(function (resolve, reject) { return (Promise.resolve([[], []])
    .then(function (_a) {
    var stdoutChunks = _a[0], stderrChunks = _a[1];
    return (Promise.resolve(subprocess)
        .then(function (subprocess) { return (subprocess
        .on('error', function (err) { return reject(err); }),
        [subprocess.stdin, subprocess.stdout, subprocess.stderr]
            .filter(function (stream) { return stream != null; })
            .forEach(function (stream) { return (stream
            .on('error', function (err) { return reject(err); })); }),
        [subprocess.stderr]
            .filter(function (stream) { return stream != null; })
            .forEach(function (stream) { return (stream
            .on('data', function (chunk) { return stderrChunks.push(chunk); })
            .on('end', function () { return reject(new Error(stderrChunks.join(''))); })); }),
        [subprocess.stdout]
            .filter(function (stream) { return stream != null; })
            .forEach(function (stream) { return (stream
            .on('data', function (chunk) { return stdoutChunks.push(chunk); })
            .on('end', function () { return resolve(stdoutChunks.join('')); })); }),
        [subprocess.stdin]
            .filter(function (stream) { return stream != null; })
            .forEach(function (stream) { return (!stream.destroyed && stream.write(stdinData, function (err) { return err != null && err != undefined && reject(err); }),
            stream.end()); })); }));
})); })); }); });
exports.promisify = promisify;
var makeSubprocess = (function (cmd) {
    var executed = false;
    var subprocess = child_process_1.exec(cmd, function (err) {
        var _a;
        return (subprocess = null,
            err != null && (subprocess = child_process_1.exec('sh'), (_a = subprocess.stderr) === null || _a === void 0 ? void 0 : _a.emit('error', err)),
            executed = true);
    });
    promise_1.waitFor(1e3).then(function () { return executed = true; });
    return (promise_1.waitUntil(function () { return executed; })
        .then(function () { return subprocess ? subprocess : child_process_1.exec(cmd); }));
});
exports.makeSubprocess = makeSubprocess;
