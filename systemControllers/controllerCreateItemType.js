"use strict"
const Controller = require('./controller');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const system = require('../system/system');
const SmartItemType = require('../systemClasses/smartItemType');

class ControllerCreateItemType extends Controller {
	constructor(request, response) {
		super(request, response);
	}


	customFormValidation(field, errors) {
		// if (field.idCode == 'title' && qstr.contains(field.value, '.')) {
		//     this.addFormError(field, 'should not contain a period character');
		// }
	}

	action_loadPageData() {
		this.responseStatus = 'loaded';
		this.formTypeDefinitionFieldBlock = `
*Item Type Definition Block;p
        `;
		this.responseData = {};

		this.prepareFields();

		this.responseData.fields.itemTypeDefinitionBlock.value = `** Test Servers
*Title
Description;p
Status;choice;$choices=Todo*, Confirmed, Not-yet-planned[notPlanned]
*Free Space in Megabytes;wn;$info=don't use commas;$example=1829282`;
		this.sendResponse();
	}

	action_processStep1() {
		const isValid = this.validateForm();
		if (isValid) {

			const itemTypeDefinitionBlock = this.getFieldValue('itemTypeDefinitionBlock');

			const smartItemType = new SmartItemType(itemTypeDefinitionBlock);
			const that = this;
			smartItemType.create(function () {
				that.sendResponse();
			});
		}
	}

	action_processStep2() {
		const isValid = this.validateForm();
		if (isValid) {

			const itemTypeDefinitionBlock = this.getFieldValue('itemTypeDefinitionBlock');

			const smartItemType = new SmartItemType(itemTypeDefinitionBlock);
			const that = this;
			smartItemType.createManageItemsPage(function () {
				that.sendResponse();
			});
		}
	}

	action_processStep3() {
		const isValid = this.validateForm();
		if (isValid) {

			const itemTypeDefinitionBlock = this.getFieldValue('itemTypeDefinitionBlock');

			const smartItemType = new SmartItemType(itemTypeDefinitionBlock);
			const that = this;
			smartItemType.createManageItemPage(function () {
				that.responseData.manageItemsPageIdCode = smartItemType.manageItemsPageIdCode;
				that.sendResponse();
			});
		}
	}

}

module.exports = ControllerCreateItemType