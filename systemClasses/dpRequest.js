"use strict"
const qstr = require('../qtools/qstr');
const qdev = require('../qtools/qdev');

class DpRequest {
    constructor(idCode) {
        this.idCode = idCode;
        this.loadMethod = '';
    }

    incrementAndProcessCallback(dpDataLoader, callback) {
        dpDataLoader.numberOfRequestsLoaded++;
        if (dpDataLoader.numberOfRequestsLoaded == dpDataLoader.dpRequests.length) {
            callback(dpDataLoader.data);
        }
        //TODO: there is an issue here that it is not executing the callback, search for callbackStackIssue
    }

}

module.exports = DpRequest