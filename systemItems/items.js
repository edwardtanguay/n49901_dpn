"use strict"
const qstr = require('../qtools/qstr');
const qdev = require('../qtools/qdev');
const system = require('../system/system');
const DpDataLoader = require('../systemClasses/dpDataLoader');

class Items {
	constructor(loadIdCode) {
		this.loadIdCode = loadIdCode;
		this.itemTypeDefinitionBlock = this.getItemTypeDefinitionBlock();
		this.dataTypeDefinitionLines = this.buildDataTypeDefinitionLines();
		this.dataTypes = this.buildDataTypes();
		// will be defined by inheriting class
		this.itemTypeIdCode = null;
		this.records = [];
		this.request = null;
		this.itemTypeTitle = qstr.forceTitleNotation(this.constructor.name);
		this.items = [];
	}

	getFormTypeDefinitionFieldBlock() {
		let r = this.getItemTypeDefinitionBlock();
		r = qstr.removeFirstLineOfStringBlock(r);
		return r;
	}

	displayForDebugging() {
		let r = "";
		this.dataTypes.forEach(function (dataType, index) {
			r += dataType.displayForDebugging() + qstr.NEW_LINE();
		});
		return r;
	}
	buildDataTypeDefinitionLines() {
		let lines = qstr.convertStringBlockToLines(this.itemTypeDefinitionBlock);
		lines = qstr.removeLineInLinesByIndex(lines, 0);
		return lines;
	}

	getSingularItemTypeIdCode() {
		return qstr.forceSingular(this.itemTypeIdCode);
	}

	buildDataTypes() {
		const dataTypes = [];

		dataTypes.push(system.instantiateDataType('id'));

		this.dataTypeDefinitionLines.forEach(function (dataTypeDefinitionLine, index) {
			dataTypes.push(system.instantiateDataType(dataTypeDefinitionLine));
		});

		dataTypes.push(system.instantiateDataType('System When Created;systemWhenCreated'));
		dataTypes.push(system.instantiateDataType('System Who Created;systemWhoCreated'));

		return dataTypes;
	}

	getDataType(dataTypeIdCode) {
		for (let dataType of this.dataTypes) {
			if (dataType.idCode == dataTypeIdCode) {
				return dataType;
			}
		}
		return null;
	}

	getDataTypeCreateStatementChunks() {
		const ra = [];
		for (const dataType of this.dataTypes) {
			ra.push(dataType.getCreateStatementChunk());
		}
		return ra;
	}

	loadItems() {
		switch (this.loadIdCode) {
			case 'all':
				this.records = this.fetch_recordsAll('menu = "main"');
				return;
		}
	}

	fillWithRecords(records) {
		this.records = records;
		for (const record of this.records) {
			const item = system.instantiateItem(this.itemTypeIdCode);
			item.fillWithRecord(record);
			this.items.push(item);
		}
	}

	getAsDefaultHtml() {
		let r = '';
		r += `<div class="title">${this.itemTypeTitle}</div>`;
		r += `<table class="itemTable">`;
		r += '<tr>';
		for (const item of this.items) {
			r += item.getAsDefaultHtmlForItems();
		}
		r += '</tr>';
		r += `</table>`;
		return r;
	}

	static fetchAll(itemTypeIdCode, callback = null) {

		const sqlStatement = `SELECT * FROM ${itemTypeIdCode}`;
		const dpDataLoader = new DpDataLoader();
		dpDataLoader.getRecordsWithSql('records', sqlStatement);
		const that = this;
		dpDataLoader.load(function (data) {
			const records = data['records'];
			if (records == null) {
				callback(null);
			} else {
				const items = system.instantiateItems(itemTypeIdCode);
				items.fillWithRecords(records);
				callback(items);
			}
		});
	}

	getBatchImportItemTypeRecords() {
		const ra = [];
		for (const item of this.items) {
			ra.push(item.getBatchImportItemTypeRecord());
		}
		return ra;


	}

	buildCode_tableHeaderElements() {
		let r = "";
		this.dataTypes.forEach(function (dataType, index) {
			if (dataType.kind == 'custom' || dataType.idCode == 'id') {
				r += dataType.buildCode_tableHeaderElement() + qstr.NEW_LINE();
			}
		});
		return r;
	}

	buildCode_tableDataElements() {
		let r = "";
		this.dataTypes.forEach(function (dataType, index) {
			if (dataType.kind == 'custom' || dataType.idCode == 'id') {
				r += dataType.buildCode_tableDataElement() + qstr.NEW_LINE();
			}
		});
		return r;
	}

	buildCode_fieldObjects() {
		let ra = [];
		this.dataTypes.forEach(function (dataType, index) {
			if (dataType.kind == 'custom' || dataType.idCode == 'id') {
				ra.push(dataType.buildCode_fieldObject());
			}
		});
		return ra.join(',' + qstr.NEW_LINE());
	}

	buildCode_visibleFieldListForComputer() {
		let ra = [];
		this.dataTypes.forEach(function (dataType, index) {
			if (dataType.kind == 'custom') {
				ra.push(dataType.idCode);
			}
		});
		return ra.join(',');
	}
	buildCode_sortFieldIdCode() {
		let r = '';
		let count = 1;
		this.dataTypes.forEach(function (dataType, index) {
			if (dataType.kind == 'custom') {
				if (count == 1) {
					r = dataType.idCode;
				}
				count++;
			}
		});
		return r;
	}

	getFieldBlock() {
		const itemTypeDefinitionBlock = this.getItemTypeDefinitionBlock();
		const lines = qstr.convertStringBlockToLines(itemTypeDefinitionBlock);
		lines.shift();
		return qstr.convertLinesToStringBlock(lines);
	}

	buildCode_responseDataBlock() {
		let lines = [];
		this.dataTypes.forEach(function (dataType, index) {
			if (dataType.kind == 'custom') {
				lines.push(dataType.buildCode_responseDataBlockLine());
			}
		});
		return qstr.convertLinesToStringBlock(lines);
	}

	buildCode_defineFieldValueLines() {
		let lines = [];
		this.dataTypes.forEach(function (dataType, index) {
			if (dataType.kind == 'custom') {
				lines.push(dataType.buildCode_defineFieldValueLine());
			}
		});
		return qstr.convertLinesToStringBlock(lines);
	}


	buildCode_definePropertyLines() {
		let lines = [];
		const that = this;
		this.dataTypes.forEach(function (dataType, index) {
			if (dataType.kind == 'custom') {
				lines.push(dataType.buildCode_definePropertyLine(that.getSingularItemTypeIdCode()));
			}
		});
		return qstr.convertLinesToStringBlock(lines);
	}

	getChoicesList() {
		const ra = [];
		let count = 1;
		for (const item of this.items) {
			let choiceListEntry = item.getChoiceListEntry();
			//select the last one
			//TODO: make this more sophisticated
			if (count == this.items.length) {
				choiceListEntry = item.getChoiceListEntry('selected');
			}
			if (!qstr.isEmpty(choiceListEntry)) {
				ra.push(choiceListEntry);
			}
			count++;

		}
		return ra.join(',');
	}

	asArray() {
		return this.items;
	}

	getIdentifyingField() {
		let r = '';
		this.dataTypes.forEach(function (dataType, index) {
			if (index == 0) {
				r = dataType.idCode;
			}
			if (dataType.idCode == 'title' || dataType.idCode == 'lastName') {
				r = dataType.idCode;
			}
		});
		return r;
	}

	getSearchFieldList() {
		const idCodes = [];
		this.dataTypes.forEach(function (dataType, index) {
			idCodes.push(dataType.idCode);
		});
		return idCodes.join(',');
	}

	getCount() {
		return this.records.length;
	}
	
	enhance() {
	}
}

module.exports = Items