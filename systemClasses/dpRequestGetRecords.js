"use strict"
const qstr = require('../qtools/qstr');
const DpRequest = require('./dpRequest');
const dpdata = require('../systemClasses/dpdata');


class DpRequestGetRecords extends DpRequest {
    constructor(idCode, sql, params) {
        super(idCode);
        this.sql = sql;
        this.params = params;
    }

    process(dpDataLoader, callback) {
        const that = this;
        dpdata.getRecordsWithSql(this.sql, this.params, function (records) {
            dpDataLoader.data[that.idCode] = records;
            that.incrementAndProcessCallback(dpDataLoader, callback);     
        });
    }
}

module.exports = DpRequestGetRecords