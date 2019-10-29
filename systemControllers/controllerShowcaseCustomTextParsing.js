"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const qdbs = require('../qtools/qdbs');
const ShowcaseBook = require('../systemItems/showcaseBook');
const markdown = require("markdown").markdown;

class ControllerShowcaseCustomTextParsing extends Controller {
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
		this.responseData.fields.inputText.value =
			`You can write with markdown text e.g. in *italics* or **bold** or type come code, e.g. \`CTRL - C \`.

But you can also combine markdown with custom variables like this:

#####Report: $title

---

The report $title was published by $author. If you want more information, you can contact $author directly or you can use $search as well.      
    
Note that you can also use dynamic variable lookup whose values come from the database:

The valid pages are $page.createItemType or $page.home or $page.login or $page.logout.
`;
		this.sendResponse();
	}

	action_processForm() {
		const isValid = this.validateForm();
		if (isValid) {

			const markdownText = this.requestData.fields.inputText.value;
			let html = markdown.toHTML(markdownText);

			// simple variable replacement
			const variables = {
				'title': 'Annual Statistics',
				'student': 'Frau Tanguay',
				'author': 'Jim Smythe',
				'search': '<a href="http://google.com">Google Search</a>'
			};
			for (const variable in variables) {
				const value = variables[variable];
				html = qstr.replaceAll(html, '$' + variable, '<span class="highlight">' + value + '</span>');
			}

			// dynamic variable replacement
			const dpDataLoader = new DpDataLoader();
			dpDataLoader.getRecordsWithSql('records', `SELECT * FROM pageItems`);
			const that = this;
			dpDataLoader.load(function (data) {
				const records = data['records'];


				html = qstr.replaceAllRegex(html, /\$page.([a-zA-Z0-9]*)/, (match, pageIdCode, offset, string) => {
					const pageItemObject = qdbs.getRecordWithIdCode(records, pageIdCode);
					if (pageItemObject) {
						return `<span class="highlight">${pageItemObject.title}</span>`;
					} else {
						return '<span>(UNKNOWN PAGE)</span>';
					}
				});

				that.requestData.fields.outputText.value = html;

				that.sendResponse();
			});
		}
	}

	doit(match, pageIdCode, offset, string, callback) {

		callback('okok');
		// if (qsys.isSqliteError(data)) {
		//     return 'nnn';
		// } else {
		//     return 'ok';
		// }
		// const that = this;
		// dpDataLoader.load(function (data) {
		// return '<span style="color:orange">' + pageIdCode + '</span>';

	}

}

module.exports = ControllerShowcaseCustomTextParsing