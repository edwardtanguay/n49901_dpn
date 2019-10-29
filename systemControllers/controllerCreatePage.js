"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const system = require('../system/system');
const PageItem = require('../systemItems/pageItem');
const ShowcaseBook = require('../systemItems/showcaseBook');

class ControllerCreatePage extends Controller {
	constructor(request, response) {
		super(request, response);
	}

	customFormValidation(field, errors) {
		if (field.idCode == 'title' && qstr.contains(field.value, '.')) {
			this.addFormError(field, 'should not contain a period character');
		}
		if (field.idCode == 'title' && qstr.contains(field.value, ',')) {
			this.addFormError(field, 'should not contain a comma');
		}
	}

	action_loadPageData() {
		//sync
		this.formTypeDefinitionFieldBlock = `
*Type; choice; $choiceSelector = radioVertical; $choices = <h>Display Simple Data from Backend</h> <in>(a very simple display-data-not-from-database page)</in> [simpleData]*, <h>Display ItemType Page</h> <in>(enables user to easily search and edit items)</in> [itemTypeDisplay], <h>Display Data from SQL statement</h> <in>(a very simple display-data-from-database page)</in> [sqlStatement], <h>Custom Form</h> <in>(type in list of fields to make a form)</in> [customForm], <h>Multi-ItemType Search Page</h> <in>(enables user to search for numerous kinds of items)</in> [multiitemSearchPage], <h>Manage Item</h> <in>(use if you add a field to an ItemType)</in> [manageItem], <h>Manage Items</h> <in>(use if you add a field to an ItemType)</in> [manageItems], <h>Text Parser</h> <in>(parses text on button-click)</in> [textParser], <h>Transformation Synchronizer</h> <in>(text automatically parsed as one types)</in> [transformationSynchronizer], <h>Screen Scraping Page</h> <in>(controller reads data from an external website)</in> [screenScraping], <h>Multiple Ajax Steps</h> <in>(a form which sends commands to controller one at a time)</in> [multipleAjaxSteps], <h>Display XML File</h> <in>(controller parses XML file and sends data to frontend)</in> [displayXmlFile]
		*Title; line; $info = Enter name of page to create.; $example = Create Quarter Report
Form Type Definition Field Block;p; $info = Define the fields you want in the form, in form definition block syntax.
*Kind; choice; $choices = System*, Custom  
Sql Statement;p          
Item Type Id Code;$example=showcaseUsers
Item Type Id Code List;$example=showcaseUsers,showcaseBooks;$info=List as many item types as you like separated by commas.
`;
		this.prepareFields();
		this.responseData.fields.sqlStatement.value = `SELECT id,title,author FROM showcaseBooks ORDER BY id DESC`;
		this.sendResponse();

	}

	action_processForm() {
		const isValid = this.validateForm();
		if (isValid) {
			const title = this.responseData.fields.title.value;
			const type = this.responseData.fields.type.value;
			const kind = this.responseData.fields.kind.value;
			const data = {
				formTypeDefinitionFieldBlock: this.responseData.fields.formTypeDefinitionFieldBlock.value,
				sqlStatement: this.responseData.fields.sqlStatement.value,
				itemTypeIdCode: this.responseData.fields.itemTypeIdCode.value,
				itemTypeIdCodeList: this.responseData.fields.itemTypeIdCodeList.value
			}

			const pageBuilder = system.instantiatePageBuilder(title, type, kind, data);
			//pageBuilder.delete(); 
			pageBuilder.buildNow();

			this.formStatus = 'success';
			this.formMessage = `The page <a href="${pageBuilder.idCode}">${pageBuilder.title}</a> was created.`;
			this.sendResponse();

			// this.formStatus = 'success';
			// this.formMessage = `No errors.`;
			// this.sendResponse();
		}
	}

}

module.exports = ControllerCreatePage