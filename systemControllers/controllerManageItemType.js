"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const qmat = require('../qtools/qmat');
const ItemTypes = require('../systemItems/itemType');
const dpod = require('../system/dpod');
const System = require('../system/system');

class ControllerManageItemType extends Controller {
    constructor(request, response) {
        super(request, response);
    }

    action_loadPageData() {
        const command = this.requestData.command;
        const id = this.requestData.id;

        this.responseData = {};
        this.responseStatus = 'loaded';

		//load field data from item type
		const itemTypes = System.instantiateItems('itemTypes');
		this.formTypeDefinitionFieldBlock = itemTypes.getFormTypeDefinitionFieldBlock();

        this.prepareFields();

                    
            
            
            
            
            
        
        if (qstr.isInList(command, 'edit, copy')) {
            const that = this;
            dpod.fetchItem(`itemType where id = ${id}`, function (item) {
                if (item == null) {
                    that.formStatus = 'error';
                    that.formMessage = `Item not found.`;
                } else {
that.responseData.fields.idCode.value = item.idCode || "";
that.responseData.fields.title.value = item.title || "";
that.responseData.fields.description.value = item.description || "";
that.responseData.fields.kind.value = item.kind || "";
that.responseData.fields.subsite.value = item.subsite || "";
that.responseData.fields.displayOrder.value = item.displayOrder || "";                    
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
const title = this.getFieldValue('title');
const description = this.getFieldValue('description');
const kind = this.getFieldValue('kind');
const subsite = this.getFieldValue('subsite');
const displayOrder = this.getFieldValue('displayOrder');

            const itemType = new ItemTypes();
            if (systemCommand == 'edit') {
                itemType.id = id;
            }

itemType.idCode = idCode;
itemType.title = title;
itemType.description = description;
itemType.kind = kind;
itemType.subsite = subsite;
itemType.displayOrder = displayOrder;            

            itemType.save();

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
        this.responseData.parsedText = qstr.parseOutline(originalText, 'itemTypes');
        this.sendResponse();
    }
}

module.exports = ControllerManageItemType