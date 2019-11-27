"use strict"
const Items = require('../systemItems/pageItems');
const dpdata = require('../systemClasses/dpdata');
const qstr = require('../qtools/qstr');
const qdev = require('../qtools/qdev');
const qsys = require('../qtools/qsys');
const System = require('../system/system');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const FormType = require('../systemClasses/smartFormType');

class Item {
	constructor(id = null) {
		this.id = id;
		this.items = null;
		this.itemTypeIdCode = null;
		this.dataTypes = [];
		this.request = null;
		this.itemTypeTitle = qstr.forceTitleNotation(this.constructor.name);
		this.fieldValidationErrors = [];
	}

	loadItem() {
		if (this.id == null) {
			for (const dataType of this.items.dataTypes) {
				this[dataType.idCode] = dataType.defaultValue;
				this.dataTypes.push(dataType);
			}
		} else {
			//todo: load from database
		}
		this.itemTypeIdCode = this.items.itemTypeIdCode;
		this.singularItemTypeIdCode = qstr.chopRight(this.itemTypeIdCode, 's');
	}

	display() {
		return `This is an ITEM with id ${this.id}.`;
	}

	getItemTypeIdCode() {
		return this.items.itemType
	}

	save() {
		dpdata.saveItemAsRecord(this);
	}

	getFieldIdCodes() {
		const ra = [];
		for (const dataType of this.items.dataTypes) {
			ra.push(dataType.idCode);
		}
		return ra;
	}

	getCustomFieldIdCodes() {
		const ra = [];
		for (const dataType of this.items.dataTypes) {
			if (dataType.kind == 'custom') {
				ra.push(dataType.idCode);
			}
		}
		return ra;
	}



	getCommaSeparatedFieldList() {
		const fieldIdCodes = this.getFieldIdCodes();
		return fieldIdCodes.join(',');
	}

	getCommaSeparatedFieldListWithoutId() {
		const commentSeparatedFieldList = this.getCommaSeparatedFieldList();
		return qstr.chopLeft(commentSeparatedFieldList, 'id,');
	}

	getSqlInsertValueList() {
		const ra = [];
		for (const dataType of this.items.dataTypes) {
			if (dataType.idCode != 'id') {
				ra.push(dataType.sqlFieldVariable);
			}
		}
		return ra.join(',');
	}

	getSqlUpdateValueList() {
		const ra = [];
		for (const dataType of this.items.dataTypes) {
			if (dataType.kind == 'custom') {
				ra.push(dataType.idCode + " = ?");
			}
		}
		return ra.join(',');
	}

	getFieldValues() {
		const ra = [];
		for (const dataType of this.items.dataTypes) {
			if (dataType.generatesAutomaticValueOnSave()) {
				ra.push(dataType.getAutomaticallyGeneratedValue());
			} else {
				ra.push(this[dataType.idCode]);
			}
		}
		return ra;
	}

	getFieldValuesWithoutId() {
		const ra = [];
		for (const dataType of this.items.dataTypes) {
			if (dataType.dataTypeIdCode != 'id') {
				if (dataType.generatesAutomaticValueOnSave()) {
					ra.push(dataType.getAutomaticallyGeneratedValue());
				} else {
					ra.push(this[dataType.idCode]);
				}
			}
		}
		return ra;
	}

	getFieldValuesWithoutIdForUpdate() {
		const ra = [];
		for (const dataType of this.items.dataTypes) {
			if (dataType.kind == 'custom') {
				if (dataType.generatesAutomaticValueOnSave()) {
					ra.push(dataType.getAutomaticallyGeneratedValue());
				} else {
					ra.push(this[dataType.idCode]);
				}
			}
		}
		return ra;
	}

	getDebuggingInfos() {
		return {
			'numberOfDataTypes': this.dataTypes.length,
			'dataTypeIdCodes': this.getDebuggingInfosDataTypeIdCodes(),
			'dataTypeDataTypeIdCodes': this.getDebuggingInfosDataTypeDataTypeIds(),
			'values': qstr.displayObjectNice(this.getDebuggingInfosValues())
		};
	}
	getDebuggingInfosDataTypeIdCodes() {
		const ra = [];
		for (const dataType of this.dataTypes) {
			ra.push(dataType.idCode);
		}
		return ra.join(',');
	}
	getDebuggingInfosDataTypeDataTypeIds() {
		const ra = [];
		for (const dataType of this.dataTypes) {
			ra.push(dataType.dataTypeIdCode);
		}
		return ra.join(',');
	}

	// this is used so that items and data types have access to the request object
	// for example, to get the current user with qsys.getCurrentUserIdCode(request)
	// e.g. currently needed for dataTypeSystemWhoCreated
	imbueWithRequest(request) {
		this.request = request;
		this.items.request = request;
		for (const dataType of this.dataTypes) {
			dataType.request = request;
		}
	}


	//TODO: check, shouldn't this be systemWhenCreated, etc.?
	static addSystemFieldValues(item, record) {
		item.id = record['id'];
		item.whenCreated = record['whenCreated'];
		item.whoCreated = record['whoCreated'];
		return item;
	}

	getFieldObjects() {
		const ra = [];
		for (const dataType of this.items.dataTypes) {
			if (dataType.kind == 'custom') {
				const dataTypeIdCode = dataType.idCode;
				ra.push(dataType.asObject(this[dataTypeIdCode]));
			}
		}
		return ra;
	}

	// TODO: make this robust, e.g.
	/*
	ORDERED FIELDS
	--------------
	server6
	server 6
	This is server 6.
	12	

	LABELED FIELDS
	--------------------
	id::2 
	idCode::server1  
	title::Server 1
	description::This is the server info.\nskdfjsdfjkd
	numberOfDirectories::1
	systemWhenCreated::2019-08-06 11:44:56
	systemWhoCreated::systemUnknown	
	
	DATATYPE SNIFFING
	--------------
	12	
	server 6
	server6
	This is server 6.
	*/
	fillWithLines(lines) {
		if (this.linesAreLabeledFields(lines)) {
			this.fillLinesAsLabeledFields(lines);
		} else {
			this.fillLinesAsOrderedFields(lines);
		}
	}

	/*
	id::2 
	idCode::server1  
	title::Server 1
	description::This is the server info.\nskdfjsdfjkd
	numberOfDirectories::1
	systemWhenCreated::2019-08-06 11:44:56
	systemWhoCreated::systemUnknown	
	*/
	fillLinesAsLabeledFields(lines) {
		for (const line of lines) {
			const parts = qstr.breakIntoParts(line, '::', 2);
			const fieldIdCode = parts[0];
			const fieldValue = parts[1];
			this[fieldIdCode] = fieldValue;
		}
		this.infuseExtras();
	}

	fillLinesAsOrderedFields(lines) {
		const customFieldIdCodes = this.getCustomFieldIdCodes();
		let index = 0;
		for (const customFieldIdCode of customFieldIdCodes) {
			this[customFieldIdCode] = lines[index] || "";
			index++;
		}
		this.infuseExtras();
	}

	/*
	find out if every line has a "::", e.g.
	id::2
	idCode::server1
	title::Server 1 
	description::[[
	This is the server info.
	skdfjsdfjkd
	]]
	numberOfDirectories::1
	systemWhenCreated::2019-08-06 11:44:56
	systemWhoCreated::systemUnknown
	*/
	linesAreLabeledFields(lines) {
		for (const line of lines) {
			if (!qstr.contains(line, '::')) {
				return false;
			}
		}
		return true;
	}

	getDebuggingInfosValues() {
		const customFieldIdCodes = this.getCustomFieldIdCodes();
		const obj = {};
		for (const customFieldIdCode of customFieldIdCodes) {
			obj[customFieldIdCode] = this[customFieldIdCode];
			//this[customFieldIdCode] = lines[index];
			//index++;
		}
		return obj;
		// return {
		//     'idCode': this.idCode,
		//     'title': this.title,
		//     'description': this.description,
		//     'whenPublished': this.whenPublished
		// };
	}


	fillWithRecord(record) {
		const fieldIdCodes = this.getFieldIdCodes();
		for (const fieldIdCode of fieldIdCodes) {
			this[fieldIdCode] = record[fieldIdCode];
		}
		this.infuseExtras();
		this.afterFillWithRecord();
	}

	afterFillWithRecord() {
		// override if item needs to post-manipulate record data
	}

	getAsDefaultHtml() {
		let r = '';
		r += `<div class="title">${this.itemTypeTitle}</div>`;
		r += `<table>`;
		for (const dataType of this.items.dataTypes) {
			r += `<tr>`;
			r += `<td class="field">${dataType.label}</td>`;
			r += `<td class="value">${this[dataType.idCode]}</td>`;
			r += `</tr>`;
		}
		r += `</table>`;
		return r;
	}

	getAsDefaultHtmlForItems() {
		let r = '';
		r += `<tr>`;
		for (const dataType of this.items.dataTypes) {
			r += `<td>${this[dataType.idCode]}</td>`;
		}
		r += `</tr>`;
		return r;
	}

	static fetchWithIdCode(itemTypeIdCode, idCode, callback) {
		const sqlStatement = `SELECT * FROM ${itemTypeIdCode} WHERE idCode = '${idCode}'`;
		const dpDataLoader = new DpDataLoader();
		dpDataLoader.getRecordWithSql('record', sqlStatement);
		const that = this;
		dpDataLoader.load(function (data) {
			const record = data['record'];
			if (record == null) {
				callback(null);
			} else {
				const item = System.instantiateItem(itemTypeIdCode);
				item.fillWithRecord(record);
				callback(item);
			}
		});
	}

	static fetchWithField(itemTypeIdCode, field, value, callback) {
		const sqlStatement = `SELECT * FROM ${itemTypeIdCode} WHERE ${field} = '${value}'`;
		const dpDataLoader = new DpDataLoader();
		dpDataLoader.getRecordWithSql('record', sqlStatement);
		const that = this;
		dpDataLoader.load(function (data) {
			const record = data['record'];
			if (record == null) {
				callback(null);
			} else {
				const item = System.instantiateItem(itemTypeIdCode);
				item.fillWithRecord(record);
				callback(item);
			}
		});
		// callback({
		//     title: 'here'
		// });
	}

	static deleteWithField(itemTypeIdCode, field, value, callback) {
		const sqlStatement = `DELETE FROM ${itemTypeIdCode} WHERE ${field} = '${value}'`;
		const dpDataLoader = new DpDataLoader();
		dpDataLoader.executeSql('result', sqlStatement);
		const that = this;
		dpDataLoader.load(function (result) {
			callback();
		});
	}

	getTemplateText() {
		let r = '';
		r += '==' + this.singularItemTypeIdCode + qstr.NEW_LINE();
		for (const dataType of this.items.dataTypes) {
			if (dataType.kind == 'custom') {
				r += dataType.getItemTextBlockLine(this.getFieldValue(dataType.idCode));
			}
		}
		r += qstr.NEW_LINE();
		return r;
	}

	// this is the old version of item templates, without the field labels
	getTemplateTextSimple() {
		let r = '';
		r += '==' + this.singularItemTypeIdCode + qstr.NEW_LINE();
		for (const dataType of this.items.dataTypes) {
			if (dataType.kind == 'custom') {
				r += dataType.getTemplateTextLine() + qstr.NEW_LINE();
			}
		}
		r = r.trim();
		return r;
	}

	getChoiceListEntry(option = '') {
		//override if these are not the right fields
		if (option == 'selected') {
			return this.title + '* [' + this.idCode + ']';
		} else {
			return this.title + ' [' + this.idCode + ']';

		}
	}

	getDefaultHtmlBodyAsBullets() {
		let r = '';
		r += '<ul>';
		for (const dataType of this.items.dataTypes) {
			if (dataType.kind == 'custom') {
				r += `<li><span class="labelPart">${dataType.label}:</span> ${dataType.getNiceValue(this)}</li>`;
			}
		}
		r += '</ul>';
		return r;
	}

	getDefaultHtmlBodyAsTable(options = {}) {
		let r = '';
		r += `<div class="d-block d-sm-none defaultHtmlBodyAsSmartphoneFieldList">`;
		for (const dataType of this.items.dataTypes) {
			if (dataType.kind == 'custom') {
				r += `<div class="label">${dataType.label}:</div>`;
				r += `<div class="data">${dataType.getNiceValue(this, options)}</div>`;
			}
		}
		r += `</div>`;
		r += '<div class="d-none d-sm-block"><table class="defaultHtmlBodyAsTable">';
		for (const dataType of this.items.dataTypes) {
			if (dataType.kind == 'custom') {
				r += `<tr>`;
				r += `<td class="label">${dataType.label}:</td>`;
				r += `<td class="data">${dataType.getNiceValue(this, options)}</td>`;
				r += `</tr>`;
			}
		}
		r += '</table></div>';
		return r;
	}

	getNiceValueOfDataType(idCode) {
		const dataType = this.getDataType(idCode);
		return dataType.getNiceValue(this);
	}

	getDataType(idCode) {
		return this.items.dataTypes.find(item => item.idCode == idCode);
	}

	// extras that are not set will be: undefined
	infuseExtras() {
		const extrasLine = this.extras;
		if (!qstr.isEmpty(extrasLine)) {
			const extrasObject = qstr.parseExtras(extrasLine);
			for (const extra in extrasObject) {
				const value = extrasObject[extra];
				this[extra] = value;
			}
		}
	}

	getFieldValue(idCode) {
		const rawValue = this[idCode];
		return rawValue == undefined ? '' : rawValue;
	}

	validate() {

		const formTypeDefinitionFieldBlock = this.items.getFormTypeDefinitionFieldBlock();
		const formType = new FormType(formTypeDefinitionFieldBlock);
		const fields = formType.getFields();

		for (const key in fields) {
			const field = fields[key];
			field.idCode = key;

			// DATATYPE VALIDATION
			//const dataType = System.instantiateDataType_withField(field);
			const dataType = this.getDataType(field.idCode);
			dataType.value = this.getFieldValue(field.idCode);
			dataType.label = field.label;
			dataType.required = field.required;
			const validationResponse = dataType.validate();
			if (!validationResponse.valid) {
				const fieldValidationError = {
					fieldIdCode: field.idCode,
					errorMessage: validationResponse.validationMessage
				};
				this.fieldValidationErrors.push(fieldValidationError);
			}
		}
		return this.fieldValidationErrors;
	}
	getPermalinkUrl() {
		return this.itemTypeIdCode + '?id=' + this.id;
	}
	getFirstFieldIdCode() {
		for (const dataType of this.items.dataTypes) {
			if (dataType.idCode != 'id') {
				return dataType.idCode;
			}
		}
		return '';
	}
	getMostLikelyTitleField() {
		for (const dataType of this.items.dataTypes) {
			if (dataType.idCode == 'title') {
				return 'title';
			}
		}
		return this.getFirstFieldIdCode();
	}

	getItemTextBlock() {
		let r = '';
		r += '==' + this.singularItemTypeIdCode + qstr.NEW_LINE();
		for (const dataType of this.items.dataTypes) {
			r += dataType.getItemTextBlockLine(this.getFieldValue(dataType.idCode));
		}
		return r;
	}

	getItemTextAddBlock() {
		let r = '';
		const newItem = System.instantiateItem(this.itemTypeIdCode);
		r += newItem.getTemplateText();
		return r;
	}
}



module.exports = Item