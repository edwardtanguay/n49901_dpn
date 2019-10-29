"use strict"
const qstr = require('../qtools/qstr');

// loadDqlStatement   = "load_users(id > 2 order by id) as allowedUsers"
// baseDqlStatement   = "users(id > 2 order by id) as allowedUsers" or "users(id > 2 order by id)"
// innerDqlStatement  = "users(id > 2 order by id)"
// recordVariableName = "users" or "allowedusers"
// itemTypeIdCode     = "users"
// sqlChunk           = "id > 2 order by id"
// whereChunk         = "id > 2"
// orderByChunk       = "id"

// examples of DQL statements:
// 'load_pageItems(all)',
// 'load_users(id > 2 order by id) as upperUsers',
// 'load_richUserRecords',
// 'build_completeReport as reportItems',
// 'build_completeReport'
class LoadDqlStatementParser {
    constructor(loadDqlStatement) {
        this.asMarker = ' as ';
        this.orderByMarker = 'order by ';
        this.kind = ''; // single, plural
        this.genre = ''; // dynamic, custom
        this.innerDqlStatement = ''; // e.g. "users(id > 2 order by id)"
        this.recordVariableName = ''; // e.g. users, allowedUsers, currentUser, pageItem, pageItems
        this.sqlChunk = '';
        this.whereChunk = '';
        this.orderByChunk = '';
        this.itemTypeIdCode = '';

        this.baseDqlStatement = qstr.chopLeft(loadDqlStatement, 'load_'); // e.g. "users(id > 2 order by id) as allowedUsers"
        if (this.baseDqlStatement.includes('(')) {
            this.genre = 'dynamic';
        } else {
            this.genre = 'custom';
        }

        if (this.baseDqlStatement.includes(this.asMarker)) {
            const parts = qstr.breakIntoParts(this.baseDqlStatement, this.asMarker);
            this.innerDqlStatement = parts[0];
            this.recordVariableName = parts[1];
        } else {
            this.innerDqlStatement = this.baseDqlStatement;
            this.recordVariableName = this.extractRecordVariableName(this.innerDqlStatement);
        }
        this.sqlChunk = this.extractSqlChunk(this.innerDqlStatement);

        if (this.recordVariableName.endsWith('s')) {
            this.kind = 'plural';
        } else {
            this.kind = 'single';
            this.itemTypeIdCode = this.itemTypeIdCode + 's';
        }
        this.parseSqlChunk(this.sqlChunk);
    }

    getCustomLoadMethod() {
        return 'load_' + this.innerDqlStatement;
    }

    parseSqlChunk(sqlChunk) {
        if (sqlChunk.includes(this.orderByMarker)) {
            // e.g. 'pageItems(menu="main" order by id desc)'
            const parts = qstr.breakIntoParts(sqlChunk, this.orderByMarker);
            this.whereChunk = parts[0];
            this.orderByChunk = parts[1];
        } else {
            // e.g. 'pageItems(menu="main")'
            if (sqlChunk == 'all') {
                this.whereChunk = '';
                this.orderByChunk = '';
            } else {
                this.whereChunk = sqlChunk;
                this.orderByChunk = '';
            }
        }
        this.prettifyOrderByChunk();
        this.whereChunk = this.whereChunk.trim();
        this.orderByChunk = this.orderByChunk.trim();
        //todo: create protection here for where and orderBy chunks to prevent sql injection
    }

    prettifyOrderByChunk() {
        if (this.orderByChunk.endsWith(' desc')) {
            const leftChunk = qstr.chopRight(this.orderByChunk, ' desc');
            this.orderByChunk = leftChunk + ' DESC';
        }
    }

    extractRecordVariableName(innerDqlStatement) {
        const parts = qstr.breakIntoParts(innerDqlStatement, '(');
        const rest = parts[1]; // e.g. "users(id > 2 order by id)" or "richUserRecords"
        if (rest.includes('(')) {
            const pieces = qstr.breakIntoParts(rest, '(');
            return pieces[0];
        }
        return parts[0];
    }

    // innerDqlStatement = e.g. "users(id > 2 order by id)"
    extractSqlChunk(innerDqlStatement) {
        let itemTypeIdCode, sqlChunk;
        [itemTypeIdCode, sqlChunk] = qstr.getFunctionAndParameterLine(innerDqlStatement);
        if (sqlChunk == 'all') {
            sqlChunk = '';
        }
        this.itemTypeIdCode = itemTypeIdCode;
        return sqlChunk;
    }

    getSqlStatement() {
        if (this.genre == 'custom') {
            return '';
        }
        switch (this.sqlChunk) {
            case '':
                return `SELECT * FROM ${this.itemTypeIdCode}`;
            default:
                if (qstr.isEmpty(this.orderByChunk)) {
                    return `SELECT * FROM ${this.itemTypeIdCode} WHERE ${this.whereChunk}`;
                } else {
                    if (qstr.isEmpty(this.whereChunk)) {
                        return `SELECT * FROM ${this.itemTypeIdCode} ORDER BY ${this.orderByChunk}`;
                    } else {
                        return `SELECT * FROM ${this.itemTypeIdCode} WHERE ${this.whereChunk} ORDER BY ${this.orderByChunk}`;
                    }
                }
        }
    }

}

module.exports = LoadDqlStatementParser