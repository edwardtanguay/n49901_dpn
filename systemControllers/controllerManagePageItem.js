"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const qmat = require('../qtools/qmat');
const PageItems = require('../systemItems/pageItem');
const dpod = require('../system/dpod');
const System = require('../system/system');

class ControllerManagePageItem extends Controller {
    constructor(request, response) {
        super(request, response);
    }

    action_loadPageData() {
        const command = this.requestData.command;
        const id = this.requestData.id;

        this.responseData = {};
        this.responseStatus = 'loaded';

		//load field data from item type
		const pageItems = System.instantiateItems('pageItems');
		this.formTypeDefinitionFieldBlock = pageItems.getFormTypeDefinitionFieldBlock();

        this.prepareFields();

                    
            
            
            
            
            
            
            
            
            
        
        if (qstr.isInList(command, 'edit, copy')) {
            const that = this;
            dpod.fetchItem(`pageItem where id = ${id}`, function (item) {
                if (item == null) {
                    that.formStatus = 'error';
                    that.formMessage = `Item not found.`;
                } else {
that.responseData.fields.idCode.value = item.idCode || "";
that.responseData.fields.menu.value = item.menu || "";
that.responseData.fields.title.value = item.title || "";
that.responseData.fields.description.value = item.description || "";
that.responseData.fields.kind.value = item.kind || "";
that.responseData.fields.subsite.value = item.subsite || "";
that.responseData.fields.type.value = item.type || "";
that.responseData.fields.accessGroups.value = item.accessGroups || "";
that.responseData.fields.displayOrder.value = item.displayOrder || "";
that.responseData.fields.holdMenu.value = item.holdMenu || "";                    
                }
                that.sendResponse();
            });
        } else {
            this.sendResponse();
        }
    }

    action_processForm() {
        const isValid = this.validateForm();
        if (isValid) {
            const systemCommand = this.requestData.command;
            const id = this.requestData.id;

const idCode = this.getFieldValue('idCode');
const menu = this.getFieldValue('menu');
const title = this.getFieldValue('title');
const description = this.getFieldValue('description');
const kind = this.getFieldValue('kind');
const subsite = this.getFieldValue('subsite');
const type = this.getFieldValue('type');
const accessGroups = this.getFieldValue('accessGroups');
const displayOrder = this.getFieldValue('displayOrder');
const holdMenu = this.getFieldValue('holdMenu');

            const pageItem = new PageItems();
            if (systemCommand == 'edit') {
                pageItem.id = id;
            }

pageItem.idCode = idCode;
pageItem.menu = menu;
pageItem.title = title;
pageItem.description = description;
pageItem.kind = kind;
pageItem.subsite = subsite;
pageItem.type = type;
pageItem.accessGroups = accessGroups;
pageItem.displayOrder = displayOrder;
pageItem.holdMenu = holdMenu;            

            pageItem.save();

            this.formStatus = ``;
            this.formMessage = ``;

            this.sendResponse();
        }
    }

    action_parseMarkdown() {
        const originalText = this.getValue('originalText').trim();
        this.responseData.parsedText = qstr.parseMarkDown(originalText);
        this.sendResponse();
    }

    action_parseOutline() {
        const originalText = this.getValue('originalText').trim();
        this.responseData.parsedText = qstr.parseOutline(originalText, 'pageItems');
        this.sendResponse();
    }
}

module.exports = ControllerManagePageItem