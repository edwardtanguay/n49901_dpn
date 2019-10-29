"use strict"
const qstr = require('../qtools/qstr');
const DataType = require('../systemDataTypes/dataType');

class DataTypeId extends DataType {
    constructor(label, extras = "") {
        super(label, extras);
        this.dataTypeIdCode = 'id';
        this.kind = 'system';

        this.baseSetup();
    }
    
    getCreateStatementChunk() {
        return `${this.idCode} INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE`;
    }
}

module.exports = DataTypeId;