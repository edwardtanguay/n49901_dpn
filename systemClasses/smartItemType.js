"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const fs = require('fs');
const dpod = require('../system/dpod');
const SmartEntityType = require('./smartEntityType');
const DpFileSystem = require('../systemClasses/dpFileSystem');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const system = require('../system/system');
const ItemType = require('../systemItems/itemType');
const DynamicFile = require('../systemClasses/dynamicFile');


class SmartItemType extends SmartEntityType {
	constructor(entityTypeDefinitionBlock) {
		super(entityTypeDefinitionBlock);
		this.entityIdentifier = '**';
		this.parse();
	}

	parse() {
		super.parse();

		// singular file
		this.singleItemTypeClassPathAndFileName = `systemItems/${this.singularCamelNotation}.js`;
		this.singleItemTypeTemplateIdCode = 'newClassItemTypeSingular';

		// plural file
		this.pluralItemTypeClassPathAndFileName = `systemItems/${this.pluralCamelNotation}.js`;
		this.pluralItemTypeTemplateIdCode = 'newClassItemTypePlural';

		this.fileTemplateVariables = {
			'singularCamelNotation': this.singularCamelNotation,
			'singularPascalNotation': this.singularPascalNotation,
			'singularTextNotation': this.singularTextNotation,
			'singularTitleNotation': this.singularTitleNotation,
			'pluralCamelNotation': this.pluralCamelNotation,
			'pluralPascalNotation': this.pluralPascalNotation,
			'pluralTextNotation': this.pluralTextNotation,
			'pluralTitleNotation': this.pluralTitleNotation,
			'instantiateWithRecordBlock': this.createInstantiateWithRecordBlock(),
			'instantiateWithObjectRecordBlock': this.createInstantiateWithObjectRecordBlock(),
			'itemTypeDefinitionBlock': this.createItemTypeDefinitionBlock()
		};

		this.sqliteTableCreationCommand = this.createSqliteTableCreationCommand();
		this.sqliteTableDeletionCommand = this.createSqliteTableDeletionCommand();

		this.manageItemsPageTitle = 'Manage ' + this.pluralTitleNotation;
		this.manageItemsPageIdCode = qstr.forceCamelNotation(this.manageItemsPageTitle);

		this.manageItemPageTitle = 'Manage ' + this.singularTitleNotation;
		this.manageItemPageIdCode = qstr.forceCamelNotation(this.manageItemPageTitle);
	}


	getDebuggingInfos() {
		return {
			'singleItemTypeClassPathAndFileName': this.singleItemTypeClassPathAndFileName,
			'pluralItemTypeClassPathAndFileName': this.pluralItemTypeClassPathAndFileName,
			'singularCamelNotation': this.singularCamelNotation,
			'singularPascalNotation': this.singularPascalNotation,
			'singularTextNotation': this.singularTextNotation,
			'singularTitleNotation': this.singularTitleNotation,
			'pluralCamelNotation': this.pluralCamelNotation,
			'pluralPascalNotation': this.pluralPascalNotation,
			'pluralTextNotation': this.pluralTextNotation,
			'pluralTitleNotation': this.pluralTitleNotation,
			'sqliteTableCreationCommand': this.sqliteTableCreationCommand,
			'sqliteTableDeletionCommand': this.sqliteTableDeletionCommand
		};
	}

	createInstantiateWithRecordBlock() {
		let r = '';
		for (const dataType of this.dataTypes) {
			r += `${qstr.TAB(2)}item.${dataType.idCode} = record['${dataType.idCode}'];${qstr.NEW_LINE()}`;
		}
		r = r.trimRight();
		return r;
	}

	createInstantiateWithObjectRecordBlock() {
		let r = '';
		for (const dataType of this.dataTypes) {
			r += `${qstr.TAB(2)}item.${dataType.idCode} = objectRecord.${dataType.idCode};${qstr.NEW_LINE()}`;
		}
		r = r.trimRight();
		return r;
	}

	createItemTypeDefinitionBlock() {
		let r = '';
		const tabs = 2;
		r += qstr.TAB(tabs) + '** ' + this.pluralTitleNotation + qstr.NEW_LINE();
		for (const dataType of this.dataTypes) {
			r += `${qstr.TAB(tabs)}${dataType.dataTypeDefinitionLine}${qstr.NEW_LINE()}`;
		}
		r = r.trimRight();
		return r;
	}

	create(callback) {
		this.create_databaseElements();
		this.create_files();
		this.add_codeChunks();
		callback();
	}

	add_codeChunks() {
		this.systemDynamicFile = new DynamicFile('system/system.js');

		const singularItemTypeIdCode = qstr.forceSingular(this.idCode); // showcaseBook
		const singularItemTypeClass = qstr.forcePascalNotation(singularItemTypeIdCode); // e.g. ShowcaseBook
		const pluralItemTypeIdCode = qstr.forcePlural(this.idCode); // showcaseBooks
		const pluralItemTypeClass = qstr.forcePascalNotation(pluralItemTypeIdCode); // e.g. ShowcaseBooks

		this.systemDynamicFile.addCodeChunkToCodeArea('includeItemArea', this.idCode, `const ${singularItemTypeClass} = require('../systemItems/${singularItemTypeIdCode}');`);
		this.systemDynamicFile.addCodeChunkToCodeArea('instantiateItemArea', this.idCode, `"${this.idCode}": ${singularItemTypeClass},`);

		this.systemDynamicFile.addCodeChunkToCodeArea('includeItemsArea', this.idCode, `const ${pluralItemTypeClass} = require('../systemItems/${pluralItemTypeIdCode}');`);
		this.systemDynamicFile.addCodeChunkToCodeArea('instantiateItemsArea', this.idCode, `"${this.idCode}": ${pluralItemTypeClass},`);

		this.systemDynamicFile.save();

	}

	delete_codeChunks() {
		this.systemDynamicFile = new DynamicFile('system/system.js');

		this.systemDynamicFile.deleteCodeChunkFromCodeArea('includeItemArea', this.idCode);
		this.systemDynamicFile.deleteCodeChunkFromCodeArea('instantiateItemArea', this.idCode);

		this.systemDynamicFile.deleteCodeChunkFromCodeArea('includeItemsArea', this.idCode);
		this.systemDynamicFile.deleteCodeChunkFromCodeArea('instantiateItemsArea', this.idCode);

		this.systemDynamicFile.save();
	}

	create_files() {
		DpFileSystem.createFileWithTemplate(this.singleItemTypeClassPathAndFileName, this.singleItemTypeTemplateIdCode, this.fileTemplateVariables);
		DpFileSystem.createFileWithTemplate(this.pluralItemTypeClassPathAndFileName, this.pluralItemTypeTemplateIdCode, this.fileTemplateVariables);
	}

	create_databaseElements() {
		const sql = this.sqliteTableCreationCommand;

		const dpDataLoader = new DpDataLoader();
		dpDataLoader.executeSql('createTable', sql);
		const that = this;
		dpDataLoader.load(function () {

			//create database entry for item type
			const itemType = new ItemType();
			itemType.idCode = that.idCode;
			itemType.title = that.pluralTitleNotation;
			itemType.kind = 'system';
			itemType.subsite = 'core';
			itemType.displayOrder = 100;
			itemType.save();

		});
	}

	delete() {
		this.delete_files();
		this.delete_databaseElements();
		this.delete_codeChunks();
	}

	delete_files() {
		qfil.deleteFile(this.singleItemTypeClassPathAndFileName);
		qfil.deleteFile(this.pluralItemTypeClassPathAndFileName);
	}

	delete_databaseElements() {
		const sql = this.sqliteTableDeletionCommand;
		const dpDataLoader = new DpDataLoader();
		dpDataLoader.executeSql('deleteTable', sql);
		const that = this;

		const deleteItemDql = `itemType where idCode = ${that.idCode}`;
		dpod.deleteItem(deleteItemDql);



		//delete manage item page
		dpDataLoader.load(function () {
			const title = that.manageItemPageTitle;
			const type = 'editItem'; // TODO: get from pageItems
			const kind = 'system'; // TODO: get from pageItems
			const pageBuilder = system.instantiatePageBuilder(title, type, kind, {});
			pageBuilder.delete();

			//delete manage items page
			dpDataLoader.load(function () {
				const title = that.manageItemsPageTitle;
				const type = 'editItem'; // TODO: get from pageItems
				const kind = 'system'; // TODO: get from pageItems
				const pageBuilder = system.instantiatePageBuilder(title, type, kind, {});
				pageBuilder.delete();
			});
		});

	}

	createSqliteTableDeletionCommand() {
		return 'DROP TABLE ' + this.idCode;
	}

	createSqliteTableCreationCommand() {
		let r = '';

		const sqlParts = [];

		sqlParts.push(`id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE`);

		for (const dataType of this.dataTypes) {
			sqlParts.push(dataType.getSqliteTableCreationCommand());
		}

		sqlParts.push(`systemWhenCreated TEXT`);
		sqlParts.push(`systemWhoCreated TEXT`);

		r += `CREATE TABLE ${this.idCode} (${sqlParts.join(',' + qstr.NEW_LINE())})`;
		return r;
	}


	createManageItemsPage(callback) {
		const title = 'Manage ' + this.fileTemplateVariables.pluralTitleNotation;
		const type = 'manageItems';
		const kind = 'system';
		const data = {
			itemTypeIdCode: this.idCode
		}
		const pageBuilder = system.instantiatePageBuilder(title, type, kind, data);
		pageBuilder.buildNow();
		callback();
	}

	createManageItemPage(callback) {
		const title = 'Manage ' + this.fileTemplateVariables.singularTitleNotation;
		const type = 'manageItem';
		const kind = 'system';
		const data = {
			itemTypeIdCode: this.idCode
		}
		const pageBuilder = system.instantiatePageBuilder(title, type, kind, data);
		pageBuilder.buildNow();
		callback();
	}

	deleteManageItemsPage(callback) {
		const title = 'Manage ' + this.fileTemplateVariables.pluralTitleNotation;
		const type = 'manageItems';
		const kind = 'system';
		const data = {
			itemTypeIdCode: this.idCode
		}
		const pageBuilder = system.instantiatePageBuilder(title, type, kind, data);
		pageBuilder.delete();
		callback();
	}

	deleteManageItemPage(callback) {

		const title = 'Manage ' + this.fileTemplateVariables.singularTitleNotation;
		const type = 'manageItem';
		const kind = 'system';
		const data = {
			itemTypeIdCode: this.idCode
		}
		const pageBuilder = system.instantiatePageBuilder(title, type, kind, data);
		pageBuilder.delete();
		callback();
	}
}

module.exports = SmartItemType