"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const ShowcaseBook = require('../systemItems/showcaseBook');
const dpod = require('../system/dpod');

class ControllerShowcaseDql extends Controller {
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
Fetch Item Dql
Fetch Items Dql
Insert Item Dql
Delete Item Dql       
        `;
        this.responseData = {};

        this.prepareFields();
        this.responseData.fields.fetchItemDql.example = `pageItem where idCode = home`;
        this.responseData.fields.fetchItemsDql.example = `showcaseBooks`;
        this.responseData.fields.deleteItemDql.example = `showcaseBook where id = 545`;
        this.sendResponse();
    }

    action_processForm() {
        const isValid = this.validateForm();
        if (isValid) {

            const fetchItemDql = this.getFieldValue('fetchItemDql').trim();
            const fetchItemsDql = this.getFieldValue('fetchItemsDql').trim();
            const insertItemDql = this.getFieldValue('insertItemDql').trim();
            const deleteItemDql = this.getFieldValue('deleteItemDql').trim();

            const that = this;

            if (!qstr.isEmpty(fetchItemDql)) {
                dpod.fetchItem(fetchItemDql, function (item) {
                    if (item == null) {
                        that.formStatus = 'error';
                        that.formMessage = `No item found with DQL statement "<code>${qstr.protectStringForHtmlInjection(fetchItemDql)}</code>".`;
                    } else {
                        that.responseData.itemHtml = item.getAsDefaultHtml();
                    }
                    that.sendResponse();
                });
            } else if (!qstr.isEmpty(fetchItemsDql)) {
                dpod.fetchItems(fetchItemsDql, function (items) {
                    if (items == null) {
                        that.formStatus = 'error';
                        that.formMessage = `No items found with "<code>${qstr.protectStringForHtmlInjection(fetchItemsDql)}</code>".`;
                    } else {
                        that.responseData.itemHtml = items.getAsDefaultHtml();
                    }
                    that.sendResponse();
                });
            } else if (!qstr.isEmpty(insertItemDql)) {
                this.formStatus = 'error';
                this.formMessage = `Insert item not implemented yet.`;
                this.sendResponse();
            } else if (!qstr.isEmpty(deleteItemDql)) {
                dpod.deleteItem(deleteItemDql, function () {
                    that.formStatus = 'success';
                    that.formMessage = `Item was deleted.`;
                    that.sendResponse();
                });
            } else {
                that.formStatus = 'error';
                that.formMessage = `No commands were sent.`;
                this.sendResponse();
            }

        }
    }

}

module.exports = ControllerShowcaseDql