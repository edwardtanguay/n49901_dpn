const sqlite3 = require('sqlite3').verbose();
const qstr = require('../qtools/qstr');
const qdbs = require('../qtools/qdbs');
const qdev = require('../qtools/qdev');
const config = require('../system/config');
const SqlSearchStatementBuilder = require('../systemClasses/sqlSearchStatementBuilder');

exports.getRecordWithSql = function (sql, params, callback) {
	const db = new sqlite3.Database(config.databasePathAndFileName());
	if (params == null) {
		db.all(sql, function (err, records) {
			let record = null;
			if (records.length > 0) {
				record = records[0];
			}
			callback(record);
		});
	} else {
		db.get(sql, params, function (err, record) {
			if (record === undefined) {
				record = null;
			}
			callback(record);
		});
	}
	db.close();
}

exports.getRecordsWithSql = function (sql, params, callback) {
	const db = new sqlite3.Database(config.databasePathAndFileName());
	if (params == null) {
		db.all(sql, function (err, records) {
			if (records == undefined) {
				callback(err);
			} else {

				if (records.length == 0) {
					records = [];
				}
				callback(records);
			}
		});
	} else {
		db.all(sql, params, function (err, records) {
			if (records === undefined) {
				records = [];
			}
			callback(records);
		});
	}
	db.close();
}

exports.getRecordsWithSearch = function (itemTypeIdCode, searchString, fieldsToSearchIdCodes = [], callback) {
	const sqlSearchStatementBuilder = new SqlSearchStatementBuilder(itemTypeIdCode, searchString, fieldsToSearchIdCodes);
	const sql = sqlSearchStatementBuilder.getSqlStatement();
	this.getRecordsWithSql(sql, null, function (records) {
		callback(records);
	});
}

//callback(status, error, id)
exports.executeSql = function (sql, params, callback) {
	const db = new sqlite3.Database(config.databasePathAndFileName());
	const that = this;

	if (params == null) {
		db.run(sql, function (err) {
			if (err) {
				callback('error', err, null);
			} else {
				let id = 0;
				const tableName = qdbs.extractTableNameFromInsertIntoSqlStatement(sql);
				if (!qstr.isEmpty(tableName)) {
					// NOTE: "SELECT last_insert_rowid() as id" returns the last added id from ANY table, not just the table we added to here
					db.get(`SELECT MAX(id) AS id FROM ${tableName}`, function (err, row) {
						if (!qstr.isEmpty(row)) {
							id = row['id'];
						}
						callback('ok', null, id);
					});
				} else {
					callback('ok', null, 0);
				}
			}
		});
	} else {
		db.run(sql, params, function (err) {
			if (err) {
				console.log(err);
				callback('error', err, null);
			} else {
				let id = 0;
				const tableName = qdbs.extractTableNameFromInsertIntoSqlStatement(sql);
				if (!qstr.isEmpty(tableName)) {
					// NOTE: "SELECT last_insert_rowid() as id" returns the last added id from ANY table, not just the table we added to here
					db.get(`SELECT MAX(id) AS id FROM ${tableName}`, function (err, row) {
						if (!qstr.isEmpty(row)) {
							id = row['id'];
						}
						callback('ok', null, id);
					});
				} else {
					callback('ok', null, 0);
				}
			}
		});
	}
	db.close();
}

exports.saveItemAsRecord = function (item) {
	if (qstr.isEmpty(item.id)) {
		const sql = `INSERT INTO ${item.itemTypeIdCode} (${item.getCommaSeparatedFieldListWithoutId()}) VALUES (${item.getSqlInsertValueList()})`;
		const params = item.getFieldValuesWithoutId();
		this.executeSql(sql, params, function (status, error, id) {});
	} else {
		const sql = `UPDATE ${item.itemTypeIdCode} SET ${item.getSqlUpdateValueList()} WHERE id = ${item.id}`;
		const params = item.getFieldValuesWithoutIdForUpdate();
		this.executeSql(sql, params, function (status, error, id) {});
	}
}