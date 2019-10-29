"use strict"
const qstr = require('../qtools/qstr');
const DpRequest = require('./dpRequest');
const dpdata = require('../systemClasses/dpdata');


class DpRequestGetRecord extends DpRequest {
    constructor(idCode, sql, params) {
        super(idCode);
        this.sql = sql;
        this.params = params;
    }

    process(dpDataLoader, callback) {
        const that = this;
        dpdata.getRecordWithSql(this.sql, this.params, function (record) {
            dpDataLoader.data[that.idCode] = record;
            that.incrementAndProcessCallback(dpDataLoader, callback);     
        });
    }
}

module.exports = DpRequestGetRecord