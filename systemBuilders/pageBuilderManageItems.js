"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const fs = require('fs');
const config = require('../system/config');
const PageBuilder = require('./pageBuilder');
const System = require('../system/system');

class PagebuilderManageItems extends PageBuilder {

	constructor(title, type, kind, data) {
		super(title, type, kind, data);
	}

	initialize() {

		this.menu = 'developerSystemManage';

		this.controllerData.itemTypeIdCode = this.data.itemTypeIdCode;
		this.controllerData.pascalItemTypeIdCode = qstr.forcePascalNotation(this.data.itemTypeIdCode);
		this.controllerData.textItemTypeIdCode = qstr.forceTextNotation(this.data.itemTypeIdCode);
		this.controllerData.singularItemTypeIdCode = qstr.forceSingular(this.data.itemTypeIdCode);
		this.controllerData.textItemTypeIdCode = qstr.forceTextNotation(this.data.itemTypeIdCode);

		this.pageData.itemTypeIdCode = this.data.itemTypeIdCode;
		this.pageData.pascalItemTypeIdCode = qstr.forcePascalNotation(this.data.itemTypeIdCode);
		this.pageData.textItemTypeIdCode = qstr.forceTextNotation(this.data.itemTypeIdCode);
		const items = System.instantiateItems(this.data.itemTypeIdCode);
		this.pageData.tableHeaderElements = items.buildCode_tableHeaderElements();
		this.pageData.tableDataElements = items.buildCode_tableDataElements();
		this.pageData.fieldObjects = items.buildCode_fieldObjects();
		this.pageData.visibleFieldListForComputer = items.buildCode_visibleFieldListForComputer();
		this.pageData.sortFieldIdCode = items.buildCode_sortFieldIdCode();
		this.pageData.singularItemTypeIdCode = qstr.forceSingular(this.data.itemTypeIdCode);
		this.pageData.singularTitleItemTypeIdCode = qstr.forceSingular(qstr.forceTitleNotation(this.data.itemTypeIdCode));
		this.pageData.manageItemPageIdCode = 'manage' + qstr.forceSingular(this.pageData.pascalItemTypeIdCode);

	}


}

module.exports = PagebuilderManageItems