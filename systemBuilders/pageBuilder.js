"use strict"
const config = require('../system/config');
const qstr = require('../qtools/qstr');
const qsys = require('../qtools/qsys');
const qdbs = require('../qtools/qdbs');
const DpFileSystem = require('../systemClasses/dpFileSystem');
const PageItem = require('../systemItems/pageItem');
const DynamicFile = require('../systemClasses/dynamicFile');
const qdev = require('../qtools/qdev');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qfil = require('../qtools/qfil');

class PageBuilder {
	constructor(title, type, kind, data) {

		this.title = title; // e.g. Create Report
		this.kind = kind; // e.g. system
		this.type = type; // e.g. editItem
		this.data = data;

		this.menu = '';

		this.typePascalNotation = qstr.forcePascalNotation(this.type);

		this.idCode = qstr.forceCamelNotation(this.title); // e.g. createReport
		this.pascalIdCode = qstr.forcePascalNotation(this.idCode); // e.g. CreateReport

		this.controllerIdCode = 'controller' + this.pascalIdCode; // e.g. controllerCreateReport
		this.controllerClassName = qstr.forcePascalNotation(this.controllerIdCode); // e.g. ControllerCreateReport

		this.pageIdCode = this.idCode;

		this.pagePathAndFileName = this.kind + 'Pages/' + this.pageIdCode + '.ejs';
		this.controllerDirectory = this.kind + 'Controllers';

		//controller
		this.controllerFileTemplateIdCode = 'newController' + this.typePascalNotation; // newControllerEditItem, newControllerTextParser
		this.controllerData = {
			'controllerClassName': this.controllerClassName
		}
		this.controllerPathAndFileName = this.controllerDirectory + '/' + this.controllerIdCode + '.js';

		//update controller factory
		this.controllerFactoryDynamicFile = new DynamicFile('systemFactories/controllerFactory.js');

		this.pageFileTemplateIdCode = 'newPage' + this.typePascalNotation; // newPageEditItem, newPageTextParser

		//get data from inheriting class
		this.pageData = {
			'pageTitle': this.title,
			'pageIdCode': this.pageIdCode,
			'controllerIdCode': this.controllerIdCode
		};
		this.itemTypeIdCodes = [];
		this.initialize();
	}


	buildNow() {
		//create page
		DpFileSystem.createFileWithTemplate(this.pagePathAndFileName, this.pageFileTemplateIdCode, this.pageData);

		//create controller
		DpFileSystem.createFileWithTemplate(this.controllerPathAndFileName, this.controllerFileTemplateIdCode, this.controllerData);

		//update controller factory
		const loadLine = `const ${this.controllerClassName} = require('../${this.controllerDirectory}/${this.controllerIdCode}');`;
		this.controllerFactoryDynamicFile.addCodeChunkToCodeArea('loadClasses', this.idCode, loadLine);
		const switchStatementLines = [
			`case '${this.controllerIdCode}':`,
			`return new ${this.controllerClassName}(request, response);`
		];
		this.controllerFactoryDynamicFile.addCodeChunkToCodeArea('switchBlock', this.idCode, switchStatementLines);
		this.controllerFactoryDynamicFile.save();

		//create database entry for page  
		const pageItem = new PageItem();
		pageItem.idCode = this.idCode;
		pageItem.title = this.title;

		// menu fields
		if (!qstr.isEmpty(this.menu)) {
			pageItem.menu = this.menu;
		} else {
			if (pageItem.title.startsWith("Showcase:")) {
				pageItem.menu = "developerShowcase";
			} else {
				pageItem.menu = 'submain';
			}
		}
		pageItem.holdMenu = pageItem.menu;
		pageItem.description = '';
		pageItem.kind = this.kind;
		pageItem.subsite = 'core';
		pageItem.fileExtension = 'ejs';
		pageItem.accessGroups = 'developers';
		pageItem.displayOrder = 100;
		pageItem.save();

	}

	delete() {
		qfil.deleteFile(this.pagePathAndFileName);
		qfil.deleteFile(this.controllerPathAndFileName);
		this.controllerFactoryDynamicFile.deleteCodeChunkFromCodeArea('switchBlock', this.idCode);
		this.controllerFactoryDynamicFile.deleteCodeChunkFromCodeArea('loadClasses', this.idCode);
		this.controllerFactoryDynamicFile.save();

		//BUGFIX: make sure it's deleted:
		qsys.sleep(20);
		this.controllerFactoryDynamicFile.deleteCodeChunkFromCodeArea('switchBlock', this.idCode);
		qsys.sleep(20);
		this.controllerFactoryDynamicFile.deleteCodeChunkFromCodeArea('switchBlock', this.idCode);

		qdbs.deleteRecordWithField('pageItems', 'idCode', this.idCode);
	}
}

module.exports = PageBuilder