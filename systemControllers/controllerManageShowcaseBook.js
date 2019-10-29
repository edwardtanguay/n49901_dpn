"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const qmat = require('../qtools/qmat');
const ShowcaseBooks = require('../systemItems/showcaseBook');
const dpod = require('../system/dpod');

class ControllerManageShowcaseBook extends Controller {
    constructor(request, response) {
        super(request, response);
    }

    action_loadPageData() {
        const command = this.requestData.command;
        const id = this.requestData.id;

        this.responseData = {};
        this.responseStatus = 'loaded';
        this.formTypeDefinitionFieldBlock = `
Title
Description;p
Author
Number of Pages;numberOfBookPages
Kind;choice;$choices=Paperback, Hardcover, E-Book[ebook], PDF[pdf]
Section;choice;$choices=Programming,items Cooking, Travel, History, Philosophy  
`;

        this.prepareFields();
        if (qstr.isInList(command, 'edit, copy')) {
            const that = this;
            dpod.fetchItem(`showcaseBook where id = ${id}`, function (item) {
                if (item == null) {
                    that.formStatus = 'error';
                    that.formMessage = `Item not found.`;
                } else {
                    that.responseData.fields.title.value = item.title || "";
                    that.responseData.fields.description.value = item.description || "";
                    that.responseData.fields.author.value = item.author || "";
                    that.responseData.fields.numberOfPages.value = item.numberOfPages || "";
                    that.responseData.fields.kind.value = item.kind || "";
                    that.responseData.fields.section.value = item.section || "";
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
            const description = this.getFieldValue('description');
            const author = this.getFieldValue('author');
            const numberOfPages = this.getFieldValue('numberOfPages');
            const kind = this.getFieldValue('kind');
            const section = this.getFieldValue('section');

            const showcaseBook = new ShowcaseBooks();
            if (systemCommand == 'edit') {
                showcaseBook.id = id;
            }

            showcaseBook.title = title;
            showcaseBook.description = description;
            showcaseBook.author = author;
            showcaseBook.numberOfPages = numberOfPages;
            showcaseBook.kind = kind;
            showcaseBook.section = section;

            showcaseBook.save();

            this.formStatus = ``;
            this.formMessage = ``;

            this.sendResponse();
        }
    }
}

module.exports = ControllerManageShowcaseBook