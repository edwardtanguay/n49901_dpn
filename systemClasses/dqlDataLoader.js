"use strict"
const qstr = require('../qtools/qstr');
const system = require('../system/system');
//const dpod = require('./dpod');
const LoadDqlStatementParser = require('./loadDqlStatementParser');
const sqlite3 = require('sqlite3').verbose();

class DqlDataLoader {
    constructor(dqlStatements) {
        this.dqlStatements = dqlStatements;
        this.loadDqlStatements = [];
        this.buildDqlStatements = [];
        this.initializeLoadAndBuildDqlStatements();
        this.loadDqlStatementsProcessed = 0;
        this.data = {};
        this.callback;
    }

    initializeLoadAndBuildDqlStatements() {
        for (const dqlStatement of this.dqlStatements) {
            if (dqlStatement.startsWith('load_')) {
                this.loadDqlStatements.push(dqlStatement);
            }
            if (dqlStatement.startsWith('build_')) {
                this.buildDqlStatements.push(dqlStatement);
            }
        }
    }

    // e.g. 'load_pageItems(all)', 'load_users(all)'
    processLoadDqlStatement(loadDqlStatement) {
        const loadDqlStatementParser = new LoadDqlStatementParser(loadDqlStatement);
        const sql = loadDqlStatementParser.getSqlStatement();
        const recordVariableName = loadDqlStatementParser.recordVariableName; // e.g. "users" or "user" or "mainPageItems"
        const db = new sqlite3.Database('data/main.sqlite');
        const that = this;
        if (loadDqlStatementParser.genre == 'dynamic') {
            db.all(sql, function (err, records) {
                if (loadDqlStatementParser.kind == 'plural') {
                    that.completeLoad(recordVariableName, records);
                } else {
                    that.completeLoad(recordVariableName, records[0]);
                }
            });
            db.close();
        } else {
            this[loadDqlStatementParser.getCustomLoadMethod()](loadDqlStatementParser.recordVariableName);
        }
    }

    load(callback) {
        this.callback = callback;
        if (this.loadDqlStatements.length > 0) {
            for (const loadDqlStatement of this.loadDqlStatements) {
                this.processLoadDqlStatement(loadDqlStatement);
            }
        } else {
            this.callback([]);
        }
    }

    completeLoad(recordVariableName, records) {
        this.loadDqlStatementsProcessed++;
        this.data[recordVariableName] = records;
        if (this.loadDqlStatementsProcessed == this.loadDqlStatements.length) {
            for (const buildDqlStatement of this.buildDqlStatements) {
                const asMarker = ' as ';
                let buildMethod = '';
                let recordVariableName = '';
                if (buildDqlStatement.includes(asMarker)) {
                    const parts = qstr.breakIntoParts(buildDqlStatement, asMarker);
                    buildMethod = parts[0];
                    recordVariableName = parts[1];
                } else {
                    buildMethod = buildDqlStatement;
                    recordVariableName = qstr.chopLeft(buildMethod, 'build_');
                }
                const infos = this[buildMethod](recordVariableName);
                this.data[infos.recordVariableName] = infos.records;
            }
            this.callback(this.data);
        }
    }


    // === CUSTOM LOAD STATEMENTS ================================================ 
    // (post process data from one SQL statement)

    load_richUserRecords(recordVariableName) {
        const db = new sqlite3.Database('data/main.sqlite');
        const that = this;
        const sql = 'select firstName,lastName from users order by id desc'
        db.all(sql, function (err, originalRecords) {

            const records = [];
            for (const originalRecord of originalRecords) {
                const record = originalRecord;
                record['firstName'] = `(${record['firstName']})`;
                records.push(record);
            }

            that.completeLoad(recordVariableName, records);
        });
        db.close();
    }


    // === CUSTOM BUILD STATEMENTS ================================================    
    // (post process data from multiple SQL statements, which were previously loaded with load statements)

    build_completeReport(recordVariableName) {
        return {
            recordVariableName: recordVariableName,
            records: [{
                name: 'pageItems',
                total: this.data.pageItems.length
            },
            {
                name: 'users',
                total: this.data.users.length
            },
            {
                name: 'richItems',
                total: this.data.richItems.length
            }
            ]
        };
    }


}

module.exports = DqlDataLoader