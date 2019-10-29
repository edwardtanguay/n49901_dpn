"use strict"
const qstr = require('../qtools/qstr');
const DpRequest = require('./dpRequest');
const dpdata = require('../systemClasses/dpdata');
const system = require('../system/system');
const qdev = require('../qtools/qdev');

class DpDataLoader {
    constructor() {
        this.dpRequests = [];
        this.dpResponses = [];
        this.data = {};
        this.numberOfRequestsLoaded = 0;
    }

    getRecordWithSql(idCode, sql, params = null) {
        this.dpRequests.push(system.instantiateDpRequestGetRecord(idCode, sql, params));
    }

    getRecordsWithSql(idCode, sql, params = null) {
        this.dpRequests.push(system.instantiateDpRequestGetRecords(idCode, sql, params));
    }

    // e.g. 'searchResults', 'showcaseUsers', 'er', ['firstName', 'lastName']
    getRecordsWithSearch(idCode, tableName, searchText, columns) {
        this.dpRequests.push(system.instantiateDpRequestGetSearch(idCode, tableName, searchText, columns));
    }

    executeSql(idCode, sql, params = null) {
        this.dpRequests.push(system.instantiateDpRequestExecuteSql(idCode, sql, params));
    }

    load(callback) {
        const that = this;
        if (this.dpRequests.length > 0) {
            for (const dpRequest of this.dpRequests) {
                //TODO: make sure a timeout isn't needed here in some instances
                dpRequest.process(that, callback);
            }
        } else {
            callback();
        }
    }

}

module.exports = DpDataLoader