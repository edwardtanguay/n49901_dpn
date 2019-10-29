"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const dpod = require('../system/dpod');
const System = require('../system/system');

class ControllerManagePageItems extends Controller {
    constructor(request, response) {
        super(request, response);
    }

    action_loadPageData() {

		const dpDataLoader = new DpDataLoader();
		dpDataLoader.getRecordsWithSql('pageItems', 'SELECT * FROM pageItems');
		const that = this;
		dpDataLoader.load(function (data) {
			that.responseStatus = 'loaded';

			const pageItemObjects = System.instantiateItemObjectsWithRecords('pageItems', data.pageItems);

			for (const pageItem of pageItemObjects) {
				pageItem.textblockToUpdateItem = pageItem.getItemTextBlock();
				pageItem.textblockToAddItem = pageItem.getItemTextAddBlock();
			}

			that.responseData = {
				pageItems: pageItemObjects
			};
			that.sendResponse();
		});		
    }

    action_deleteItem() {
        const item = this.requestData.item;
        const that = this;
        dpod.deleteItem(`pageItem where id = ${item.id}`, function () {
            that.sendResponse();
        });
    }

}

module.exports = ControllerManagePageItems