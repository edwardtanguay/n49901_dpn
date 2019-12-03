"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const dpod = require('../system/dpod');
const System = require('../system/system');

class ControllerManageTestServers extends Controller {
    constructor(request, response) {
        super(request, response);
    }

    action_loadPageData() {

		const dpDataLoader = new DpDataLoader();
		dpDataLoader.getRecordsWithSql('testServers', 'SELECT * FROM testServers');
		const that = this;
		dpDataLoader.load(function (data) {
			that.responseStatus = 'loaded';

			const testServerObjects = System.instantiateItemObjectsWithRecords('testServers', data.testServers);

			for (const testServer of testServerObjects) {
				testServer.textblockToUpdateItem = testServer.getItemTextBlock();
				testServer.textblockToAddItem = testServer.getItemTextAddBlock();
			}

			that.responseData = {
				testServers: testServerObjects
			};
			that.sendResponse();
		});		
    }

    action_deleteItem() {
        const item = this.requestData.item;
        const that = this;
        dpod.deleteItem(`testServer where id = ${item.id}`, function () {
            that.sendResponse();
        });
    }

}

module.exports = ControllerManageTestServers