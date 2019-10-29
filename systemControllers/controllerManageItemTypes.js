"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const dpod = require('../system/dpod');
const System = require('../system/system');

class ControllerManageItemTypes extends Controller {
    constructor(request, response) {
        super(request, response);
    }

    action_loadPageData() {

		const dpDataLoader = new DpDataLoader();
		dpDataLoader.getRecordsWithSql('itemTypes', 'SELECT * FROM itemTypes');
		const that = this;
		dpDataLoader.load(function (data) {
			that.responseStatus = 'loaded';

			const itemTypeObjects = System.instantiateItemObjectsWithRecords('itemTypes', data.itemTypes);

			for (const itemType of itemTypeObjects) {
				itemType.textblockToUpdateItem = itemType.getItemTextBlock();
				itemType.textblockToAddItem = itemType.getItemTextAddBlock();
			}

			that.responseData = {
				itemTypes: itemTypeObjects
			};
			that.sendResponse();
		});		
    }

    action_deleteItem() {
        const item = this.requestData.item;
        const that = this;
        dpod.deleteItem(`itemType where id = ${item.id}`, function () {
            that.sendResponse();
        });
    }

}

module.exports = ControllerManageItemTypes