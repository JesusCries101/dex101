"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var mkdirSync = (function (recursive) { return (function (folderpath) { return (recursive ? ((function () {
    var folderpathParent = path.dirname(folderpath);
    if (path.relative(folderpath, folderpathParent) !== '' &&
        !fs.existsSync(folderpathParent))
        mkdirSync(recursive)(folderpathParent);
    return (fs.existsSync(folderpathParent) &&
        fs.statSync(folderpathParent).isDirectory() && (fs.existsSync(folderpath) ? (fs.statSync(folderpath).isDirectory()) : (fs.mkdirSync(folderpath), true)));
})()) : ((function () {
    var stackFolderpath = [folderpath];
    var folderpathParent = path.dirname(folderpath);
    while (path.relative(folderpath, folderpathParent) !== '' &&
        !fs.existsSync(folderpathParent)) {
        stackFolderpath.push(folderpathParent);
        folderpathParent = path.dirname(folderpathParent);
    }
    if (fs.statSync(folderpathParent).isFile())
        return false;
    while (stackFolderpath.length > 0) {
        var folderpath_1 = stackFolderpath.pop();
        if (stackFolderpath.length > 0) {
            fs.mkdirSync(folderpath_1);
        }
        else {
            return (fs.existsSync(folderpath_1) ? (fs.statSync(folderpath_1).isDirectory()) : (fs.mkdirSync(folderpath_1), true));
        }
    }
    return true;
})())); }); });
exports.mkdirSync = mkdirSync;
var writeFileSync = (function (blobpath, data) { return (mkdirSync(false)(path.dirname(blobpath)) &&
    !(fs.existsSync(blobpath) && fs.statSync(blobpath).isDirectory()) && (fs.writeFileSync(blobpath, data), true)); });
exports.writeFileSync = writeFileSync;
var unlinkSync = (function (blobpath) { return (fs.existsSync(blobpath) &&
    fs.statSync(blobpath).isFile() &&
    (function () {
        try {
            return (fs.unlinkSync(blobpath), true);
        }
        catch (err) {
            return false;
        }
    })()); });
exports.unlinkSync = unlinkSync;
var rmdirSync = (function (recursive) { return (function (folderpath) { return ((function () {
    return (fs.existsSync(folderpath) &&
        fs.statSync(folderpath).isDirectory() &&
        fs.readdirSync(folderpath)
            .map(function (filename) { return path.join(folderpath, filename); })
            .map(function (filepath) { return (fs.statSync(filepath).isFile() ?
            unlinkSync(filepath) :
            rmdirSync(recursive)(filepath)); })
            .reduce(function (acc, val) { return acc && val; }, true) &&
        (function () {
            try {
                return (fs.rmdirSync(folderpath), true);
            }
            catch (err) {
                return false;
            }
        })());
})()); }); });
exports.rmdirSync = rmdirSync;
