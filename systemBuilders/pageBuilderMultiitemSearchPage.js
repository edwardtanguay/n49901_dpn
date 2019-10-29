"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const fs = require('fs');
const config = require('../system/config');
const PageBuilder = require('./pageBuilder');
const System = require('../system/system');

class pageBuilderMultiitemSearchPage extends PageBuilder {

	constructor(title, type, kind, data) {
		super(title, type, kind, data);
	}

	initialize() {

		this.itemTypeIdCodes = qstr.breakIntoParts(this.data.itemTypeIdCodeList, ',');

		this.controllerData.dpDataLoaderBlock = this.buildDpDataLoaderBlock();
		this.controllerData.searchObjectBuildingCodeBlocks = this.buildSearchObjectBuildingCodeBlocks();

		this.pageData.refreshUrlFromPageState = this.pageIdCode;
	}

	buildDpDataLoaderBlock() {
		let r = '';
		for (const itemTypeIdCode of this.itemTypeIdCodes) {
			const singularItemTypeIdCode = qstr.forceSingular(itemTypeIdCode);
			r += qstr.TAB(2) + `dpDataLoader.getRecordsWithSql('${singularItemTypeIdCode}Records', 'select * from ${itemTypeIdCode}');` + qstr.NEW_LINE();
		}
		return r;
	}


	buildSearchObjectBuildingCodeBlocks() {
		let r = '';
		for (const itemTypeIdCode of this.itemTypeIdCodes) {
			const singularItemTypeIdCode = qstr.forceSingular(itemTypeIdCode);
			const title = singularItemTypeIdCode.toUpperCase();
			const itemTypeIdCodeTitleNotation = qstr.forceTitleNotation(singularItemTypeIdCode);
			const item = System.instantiateItem(itemTypeIdCode);
			const firstFieldIdCode = item.getMostLikelyTitleField();
			r += `
			// ${title}
			const ${singularItemTypeIdCode}ItemObjects = System.instantiateItemObjectsWithRecords('${itemTypeIdCode}', data.${singularItemTypeIdCode}Records);
			for (const ${singularItemTypeIdCode} of ${singularItemTypeIdCode}ItemObjects) {
				const searchObject = {
					id: ${singularItemTypeIdCode}.id,
					kind: '${itemTypeIdCodeTitleNotation}',
					title: ${singularItemTypeIdCode}.${firstFieldIdCode},
					whenCreated: ${singularItemTypeIdCode}.systemWhenCreated,
					niceDate: qdat.getShortMonthDay(${singularItemTypeIdCode}.systemWhenCreated),
					permalinkUrl: ${singularItemTypeIdCode}.getPermalinkUrl()
				};
				searchDataitems.push(searchObject)
			}			
			`;
		}
		return r;
	}
}

module.exports = pageBuilderMultiitemSearchPage