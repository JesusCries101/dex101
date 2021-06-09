"use strict";
exports.__esModule = true;
var ThunkQueue_1 = require("./ThunkQueue");
var memoizedQueuefy = (function (config) {
    var thunkQueue = new ThunkQueue_1["default"](config.config);
    return function (thunk) { return (function () { return (thunkQueue.push()
        .then(function () { return config.onExecution({
        getConfig: thunkQueue.getConfig.bind(thunkQueue),
        setConfig: thunkQueue.setConfig.bind(thunkQueue)
    }); })
        .then(thunk)); }); };
});
exports.memoizedQueuefy = memoizedQueuefy;
