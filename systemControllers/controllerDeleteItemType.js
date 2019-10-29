"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const ShowcaseBook = require('../systemItems/showcaseBook');
const SmartItemType = require('../systemClasses/smartItemType');
const dpod = require('../system/dpod');

class ControllerDeleteItemType extends Controller {
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

        const that = this;
        dpod.fetchItems('itemTypes', function (items) {
            
            that.formTypeDefinitionFieldBlock = `
            Item Type Id Code; choice; $choices=${items.getChoicesList()}; $choiceSelector = radioVertical
                    `;
                    that.responseData = {};
            
                    that.prepareFields();
                    //that.responseData.fields.title.value = `putDefaultValueHere`;

            that.sendResponse();
        });
    }


    action_processStep1() {
        const isValid = this.validateForm();
        if (isValid) {

            const itemTypeIdCode = this.getFieldValue('itemTypeIdCode');
            const itemTypeDefinitionBlock = '** ' + itemTypeIdCode;

            const smartItemType = new SmartItemType(itemTypeDefinitionBlock);
            const that = this;
            smartItemType.deleteManageItemsPage(function() {
                that.formStatus = 'success';
                that.formMessage = `Manage Items page deleted.`;
                that.sendResponse();
            });
        }
    }

    action_processStep2() {
        const isValid = this.validateForm();
        if (isValid) {

            const itemTypeIdCode = this.getFieldValue('itemTypeIdCode');
            const itemTypeDefinitionBlock = '** ' + itemTypeIdCode;

            const smartItemType = new SmartItemType(itemTypeDefinitionBlock);
            const that = this;
            smartItemType.deleteManageItemPage(function() {
                that.formStatus = 'success';
                that.formMessage = `Manage Item page deleted.`;
                that.sendResponse();
            });

        }
    }


    action_processStep3() {
        const isValid = this.validateForm();
        if (isValid) {

            const itemTypeIdCode = this.getFieldValue('itemTypeIdCode');
            const itemTypeDefinitionBlock = '** ' + itemTypeIdCode;

            const smartItemType = new SmartItemType(itemTypeDefinitionBlock);
            smartItemType.delete();

            this.formStatus = 'success';
            this.formMessage = `ItemType <code>${smartItemType.idCode}</code> was deleted. <a href="deleteItemType">Refresh menu</a>.`;

            this.sendResponse();

        }
    }

}

module.exports = ControllerDeleteItemType