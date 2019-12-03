"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qdat = require('../qtools/qdat');
const qstr = require('../qtools/qstr');
const dpod = require('../system/dpod');
const System = require('../system/system');

class ControllerTestServers extends Controller {
	constructor(request, response) {
		super(request, response);
	}

	action_loadPageData() {
		const dpDataLoader = new DpDataLoader();
		dpDataLoader.getRecordsWithSql('testServerRecords', 'select * from testServers');
		dpDataLoader.load(data => {

			const testServers = System.instantiateItemsWithRecords('testServers', data.testServerRecords);
			testServers.enhance();

			const testServerObjects = testServers.asArray();

			for (const testServer of testServerObjects) {
				testServer.htmlBody = qstr.parseOutline(testServer.notes, '', { highlightedDateLines: true, highlightedDateLinesStart: qdat.getDateFromDateTime(testServer.systemWhenCreated) });
				testServer.itemTextBlock = testServer.getItemTextBlock();
			}

			this.responseData.testServers = testServerObjects;

			qsys.currentUserData(this.request, userData => {
				this.responseData.userData = userData;
				this.sendResponse();
			});
		});
	}

	action_deleteItem() {
		const item = this.requestData.item;
		dpod.deleteItem(`testServer where id = ${item.id}`, () => {
			this.sendResponse();
		});
	}

}

module.exports = ControllerTestServers