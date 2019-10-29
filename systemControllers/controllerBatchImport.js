"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qfil = require('../qtools/qfil');
const qstr = require('../qtools/qstr');
const qarr = require('../qtools/qarr');
const ShowcaseBook = require('../systemItems/showcaseBook');
const markdown = require("markdown").markdown;
const BatchImportProcessor = require('../systemClasses/batchImportProcessor');

class ControllerBatchImport extends Controller {
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
Input Text;p; $info = Note: The TAB key works in this box. 
Output Text;p
        `;
		this.responseData = {};
		this.prepareFields();

		//         this.responseData.fields.inputText.value = `==dpnVersion
		// 00100
		// Major Version with Batch Import
		// You can now add items in classic Datapod fashion by recording them first in a text file, and then dumping them all at once into Batch Import which will automatically read them in.
		// 2019-04-06
		// `;

		//this.responseData.fields.inputText.value = qfil.getContentOfDataFile('\\showcases\\showcaseBatchImport.txt');
		//this.responseData.fields.inputText.value = '';

		const that = this;
		BatchImportProcessor.getBatchImportItemTypeRecords(function (batchImportItemTypeRecords) {
			that.responseData.batchImportItemTypeRecords = qarr.multisort(batchImportItemTypeRecords, ['title'], ['asc']);
			that.sendResponse();
		});
	}

	action_processForm() {
		const isValid = this.validateForm();
		if (isValid) {

			const batchImportText = this.requestData.fields.inputText.value;

			const batchImportProcessor = new BatchImportProcessor(batchImportText);
			//let html = batchImportProcessor.renderAsHtml();

			//this.requestData.fields.inputText.value = batchImportProcessor.regenerateBatchImportText();
			//this.requestData.fields.outputText.value = html;
			this.responseData.batchImportBlockObjectRecords = batchImportProcessor.getBatchImportBlockObjectRecords();

			this.sendResponse();
		}
	}

	action_import() {
		const batchImportBlockObjectRecords = this.requestData.batchImportBlockObjectRecords;

		const batchImportProcessor = new BatchImportProcessor(batchImportBlockObjectRecords);
		batchImportProcessor.saveAndRegenerate();
		this.responseData.batchImportBlockObjectRecords = batchImportProcessor.regeneratedBatchImportBlockObjectRecords;
		this.responseData.originText = batchImportProcessor.regeneratedOriginText;

		this.formStatus = 'success';
		this.formMessage = this.buildFormMessageFromImport(batchImportProcessor);

		this.sendResponse();
	}

	buildFormMessageFromImport(batchImportProcessor) {
		const textImported = `${qstr.smartPlural(batchImportProcessor.numberOfItemsImported, 'item was', 'items were')} imported`;
		const textUpdated = `${qstr.smartPlural(batchImportProcessor.numberOfItemsUpdated, 'item was', 'items were')} updated`;
		if (batchImportProcessor.numberOfItemsImported > 0 && batchImportProcessor.numberOfItemsUpdated == 0) {
			return textImported + '.';
		} else if (batchImportProcessor.numberOfItemsImported == 0 && batchImportProcessor.numberOfItemsUpdated > 0) {
			return textUpdated + '.';
		} else {
			return textImported + ', ' + textUpdated + '.';
		}
	}


}

module.exports = ControllerBatchImport