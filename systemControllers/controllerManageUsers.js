"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const dpod = require('../system/dpod');

class ControllerManageUsers extends Controller {
    constructor(request, response) {
        super(request, response);
    }

    action_loadPageData() {

        const dpDataLoader = new DpDataLoader();
        dpDataLoader.getRecordsWithSql('users', 'SELECT * FROM users');
        const that = this;
        dpDataLoader.load(function (data) {
            that.responseStatus = 'loaded';
            that.responseData = {
                users: data['users']
            };
            that.sendResponse();
        });
    }

    action_deleteItem() {
        const item = this.requestData.item;
        const that = this;
        dpod.deleteItem(`user where id = ${item.id}`, function () {
            that.sendResponse();
        });
    }

}

module.exports = ControllerManageUsers