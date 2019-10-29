"use strict"
const qstr = require('../qtools/qstr');
const DpRequest = require('./dpRequest');
const dpdata = require('../systemClasses/dpdata');


class DpRequestGetSearch extends DpRequest {
    constructor(idCode, tableName, searchText, columns, params) {
        super(idCode);
        this.tableName = tableName;
        this.searchText = searchText;
        this.columns = columns;
        this.params = params;
    }

    process(dpDataLoader, callback) {
        const that = this;
        dpdata.getRecordsWithSearch(this.tableName, this.searchText, this.columns, function (records) {
            dpDataLoader.data[that.idCode] = records;
            that.incrementAndProcessCallback(dpDataLoader, callback);     
        });
    }
}

module.exports = DpRequestGetSearch