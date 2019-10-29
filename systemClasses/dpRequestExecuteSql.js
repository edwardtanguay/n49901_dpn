"use strict"
const qstr = require('../qtools/qstr');
const DpRequest = require('./dpRequest');
const dpdata = require('./dpdata');
const qdev = require('../qtools/qdev');


class DpRequestExecuteSql extends DpRequest {
    constructor(idCode, sql, params) {
        super(idCode);
        this.sql = sql;
        this.params = params;
    }

    process(dpDataLoader, callback) {
        const that = this;
        dpdata.executeSql(this.sql, this.params, function (status, error, id) {
            dpDataLoader.data[that.idCode] = {status: status, error: error, id: id};
            that.incrementAndProcessCallback(dpDataLoader, callback);            
        });
    }
}

module.exports = DpRequestExecuteSql