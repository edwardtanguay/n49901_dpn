"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const qmat = require('../qtools/qmat');
const TestServers = require('../systemItems/testServer');
const dpod = require('../system/dpod');
const System = require('../system/system');

class ControllerManageTestServer extends Controller {
    constructor(request, response) {
        super(request, response);
    }

    action_loadPageData() {
        const command = this.requestData.command;
        const id = this.requestData.id;

        this.responseData = {};
        this.responseStatus = 'loaded';

		//load field data from item type
		const testServers = System.instantiateItems('testServers');
		this.formTypeDefinitionFieldBlock = testServers.getFormTypeDefinitionFieldBlock();

        this.prepareFields();

                    
            this.responseData.fields.notes.info = `Note that the TAB key can be used in this field to indent lines for the outline.`
        
        if (qstr.isInList(command, 'edit, copy')) {
            const that = this;
            dpod.fetchItem(`testServer where id = ${id}`, function (item) {
                if (item == null) {
                    that.formStatus = 'error';
                    that.formMessage = `Item not found.`;
                } else {
that.responseData.fields.title.value = item.title || "";
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

const title = this.getFieldValue('title');
const notes = this.getFieldValue('notes');

            const testServer = new TestServers();
            if (systemCommand == 'edit') {
                testServer.id = id;
            }

testServer.title = title;
testServer.notes = notes;            

            testServer.save();

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
        this.responseData.parsedText = qstr.parseOutline(originalText, 'testServers');
        this.sendResponse();
    }
}

module.exports = ControllerManageTestServer