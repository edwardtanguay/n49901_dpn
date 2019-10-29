"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const ShowcaseBook = require('../systemItems/showcaseBook');
const markdown = require("markdown").markdown;
const TextChunkDocument = require('../systemTextParsers/textChunkDocument');

class ControllerShowcaseTextChunkDocument extends Controller {
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
			`==note
The Title of the Note
This is a message of a note item. 

==note
Another Note
[[
This is another note, but notice it is multiline because of the square brackets:
1. one
2. two
3. three
]]
And this is another bit of information.

This is just a paragraph separated by text. 
[[
- note that you retain indented paragraphs
	- like this
	- like this
		- and
		- like 
		- this
	- at any level
- like this
]]
            
The TextChunkDocument class simply collects blocks of text into TextChunk objects which make them easier for you to parse any way you want. 
Lines that have no space between then will kept together in a TextChunk object.
Like this.

`;
		this.sendResponse();
	}

	action_processForm() {
		const isValid = this.validateForm();
		if (isValid) {

			const textDocument = this.requestData.fields.inputText.value;
			const textChunkDocument = new TextChunkDocument(textDocument);
			let html = textChunkDocument.renderAsHtml();
			this.requestData.fields.outputText.value = html;
			this.sendResponse();
		}
	}

}

module.exports = ControllerShowcaseTextChunkDocument