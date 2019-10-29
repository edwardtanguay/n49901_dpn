"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const dpod = require('../system/dpod');
const System = require('../system/system');

class ControllerManageShowcaseUsers extends Controller {
    constructor(request, response) {
        super(request, response);
    }

    action_loadPageData() {

		const dpDataLoader = new DpDataLoader();
		dpDataLoader.getRecordsWithSql('showcaseUsers', 'SELECT * FROM showcaseUsers');
		const that = this;
		dpDataLoader.load(function (data) {
			that.responseStatus = 'loaded';

			const showcaseUserObjects = System.instantiateItemObjectsWithRecords('showcaseUsers', data.showcaseUsers);

			for (const showcaseUser of showcaseUserObjects) {
				showcaseUser.textblockToUpdateItem = showcaseUser.getItemTextBlock();
				showcaseUser.textblockToAddItem = showcaseUser.getItemTextAddBlock();
			}

			that.responseData = {
				showcaseUsers: showcaseUserObjects
			};
			that.sendResponse();
		});		
    }

    action_deleteItem() {
        const item = this.requestData.item;
        const that = this;
        dpod.deleteItem(`showcaseUser where id = ${item.id}`, function () {
            that.sendResponse();
        });
    }

}

module.exports = ControllerManageShowcaseUsers