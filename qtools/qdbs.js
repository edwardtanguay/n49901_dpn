// qdbs = "Quick Database Functions": functions that parse SQL, etc.
"use strict"
const qstr = require('../qtools/qstr');
const qdbs = require('../qtools/qdbs');
const qdev = require('../qtools/qdev');
const Dpdata = require('../systemClasses/dpdata');

exports.extractTableNameFromInsertIntoSqlStatement = function (sql) {
    if (sql.toUpperCase().startsWith("INSERT INTO")) {
        const parts = qstr.breakIntoParts(sql, ' ');
        const tableName = qstr.getSafePart(parts, 2);
        return tableName;
    } else {
        return "";
    }
}

exports.executeSql = function (sql) {
    Dpdata.executeSql(sql, null, function (status, error) {
        if (status == 'error') {
            console.log('ERROR: ' + error.message);
        }
    });
}

exports.deleteRecordWithField = function (itemTypeIdCode, fieldName, fieldValue) {
    qdbs.executeSql(`DELETE FROM ${itemTypeIdCode} WHERE ${fieldName}='${fieldValue}'`);
}

exports.getRecordWithIdCode = function (records, idCode) {
    return records.filter(item => item.idCode == idCode)[0];
}