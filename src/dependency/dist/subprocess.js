"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = void 0;
var childProcess = require("child_process");
var PromiseCapability_1 = require("./PromiseCapability");
var exec = function (cmd, cwd) {
    if (cwd === void 0) { cwd = process.cwd(); }
    return ((function (capability) { return (Object.assign(capability.promise, {
        subprocess: (childProcess.exec(cmd, { cwd: cwd }, function (err, stdout, stderr) {
            if (err) {
                capability.reject(err);
            }
            else {
                capability.resolve({ stdout: stdout, stderr: stderr });
            }
        }))
    })); })(new PromiseCapability_1.PromiseCapability()));
};
exports.exec = exec;
