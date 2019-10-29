"use strict"
const qstr = require('../qtools/qstr');
const qdev = require('../qtools/qdev');

class SqlSearchStatementBuilder {
    constructor(itemTypeIdCode, searchString, fieldsToSearchIdCodes) {
        this.itemTypeIdCode = qstr.projectSqlValue(itemTypeIdCode);
        this.searchString = searchString;
        this.searchChunks = qstr.breakIntoParts(this.searchString, ' ');
        this.fieldsToSearchIdCodes = fieldsToSearchIdCodes;
        this.whereChunk = "";
    }

    prepareSqlStatement() {
        const orChunks = [];
        for (const searchChunk of this.searchChunks) {
            const protectedSearchChunk = qstr.projectSqlValue(searchChunk);
            const fieldChunks = [];
            for (const fieldsToSearchIdCode of this.fieldsToSearchIdCodes) {
                fieldChunks.push(`${fieldsToSearchIdCode} LIKE "%${protectedSearchChunk}%"`);
            }
            orChunks.push("(" + fieldChunks.join(" OR ") + ")");
        }
        this.whereChunk = orChunks.join(' AND ');
    }

    getSqlStatement() {
        this.prepareSqlStatement();
        return `SELECT * FROM ${this.itemTypeIdCode} WHERE ${this.whereChunk}`;
    }
}

module.exports = SqlSearchStatementBuilder