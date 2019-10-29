"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const dpod = require('../system/dpod');

class ControllerShowcaseSearchAndDisplayItemType extends Controller {
    constructor(request, response) {
        super(request, response);
    }

    action_loadPageData() {

        // const dpDataLoader = new DpDataLoader();
        // dpDataLoader.getRecordsWithSql('showcaseUsers', 'SELECT * FROM showcaseUsers');
        const that = this;
        dpod.fetchItems("showcaseUsers", function (showcaseUsers) {
            const showcaseUsersObjects = showcaseUsers.asArray();
            for (const showcaseUser of showcaseUsersObjects) {
                showcaseUser.htmlBody = showcaseUser.getDefaultHtmlBodyAsTable();
            }
            that.responseData.showcaseUsers = showcaseUsersObjects;
            that.responseData.userIsCurrentlyLoggedIn = qsys.userIsCurrentlyLoggedIn(that.request);
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

module.exports = ControllerShowcaseSearchAndDisplayItemType