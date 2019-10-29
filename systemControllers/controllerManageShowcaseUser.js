"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const qmat = require('../qtools/qmat');
const ShowcaseUsers = require('../systemItems/showcaseUser');
const dpod = require('../system/dpod');
const System = require('../system/system');

class ControllerManageShowcaseUser extends Controller {
    constructor(request, response) {
        super(request, response);
    }

    action_loadPageData() {
        const command = this.requestData.command;
        const id = this.requestData.id;

        this.responseData = {};
        this.responseStatus = 'loaded';

		//load field data from item type
		const showcaseUsers = System.instantiateItems('showcaseUsers');
		this.formTypeDefinitionFieldBlock = showcaseUsers.getFormTypeDefinitionFieldBlock();

        this.prepareFields();

                    
            
            
            
            
            
            
            
            
            this.responseData.fields.notes.info = `Note that the TAB key can be used in this field to indent lines for the outline.`
        
        if (qstr.isInList(command, 'edit, copy')) {
            const that = this;
            dpod.fetchItem(`showcaseUser where id = ${id}`, function (item) {
                if (item == null) {
                    that.formStatus = 'error';
                    that.formMessage = `Item not found.`;
                } else {
that.responseData.fields.login.value = item.login || "";
that.responseData.fields.password.value = item.password || "";
that.responseData.fields.firstName.value = item.firstName || "";
that.responseData.fields.lastName.value = item.lastName || "";
that.responseData.fields.status.value = item.status || "";
that.responseData.fields.accessGroups.value = item.accessGroups || "";
that.responseData.fields.displayOrder.value = item.displayOrder || "";
that.responseData.fields.description.value = item.description || "";
that.responseData.fields.extendedDescription.value = item.extendedDescription || "";
that.responseData.fields.notes.value = item.notes || "";                    
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

const login = this.getFieldValue('login');
const password = this.getFieldValue('password');
const firstName = this.getFieldValue('firstName');
const lastName = this.getFieldValue('lastName');
const status = this.getFieldValue('status');
const accessGroups = this.getFieldValue('accessGroups');
const displayOrder = this.getFieldValue('displayOrder');
const description = this.getFieldValue('description');
const extendedDescription = this.getFieldValue('extendedDescription');
const notes = this.getFieldValue('notes');

            const showcaseUser = new ShowcaseUsers();
            if (systemCommand == 'edit') {
                showcaseUser.id = id;
            }

showcaseUser.login = login;
showcaseUser.password = password;
showcaseUser.firstName = firstName;
showcaseUser.lastName = lastName;
showcaseUser.status = status;
showcaseUser.accessGroups = accessGroups;
showcaseUser.displayOrder = displayOrder;
showcaseUser.description = description;
showcaseUser.extendedDescription = extendedDescription;
showcaseUser.notes = notes;            

            showcaseUser.save();

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
        this.responseData.parsedText = qstr.parseOutline(originalText, 'showcaseUsers');
        this.sendResponse();
    }
}

module.exports = ControllerManageShowcaseUser