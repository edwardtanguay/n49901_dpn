"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const ShowcaseBook = require('../systemItems/showcaseBook');

class ControllerCreatePageBuilder extends Controller {
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
Data Type Definition Line;$example=Display Data from Sql Statement [sqlStatement]
        `;
		this.responseData = {};

		this.prepareFields();
		this.responseData.fields.dataTypeDefinitionLine.value = `Display Data from Sql Statement [sqlStatement]`;
		this.sendResponse();
	}

	action_processForm() {
		const isValid = this.validateForm();
		if (isValid) {
			const dataTypeDefinitionLine = this.getFieldValue('dataTypeDefinitionLine');

			//parse: Display Data from Sql Statement [sqlStatement]
			const parts = qstr.breakIntoParts(dataTypeDefinitionLine, '[');
			const title = parts[0];
			const idCode = qstr.chopRight(parts[1], ']');
			const idCodePascal = qstr.forcePascalNotation(idCode);

			let r = ''

			const dataTypeDefinitionLineEnchanced = this.getDataTypeDefinitionLineEnchanced(dataTypeDefinitionLine);

			r += `<h4>Steps:</h4>`;
			r += `<ul>`;
			r += `<li>In <code>systemControllers/controllerCreatePage.js</code> add: <br/><textarea class="codeArea">,${dataTypeDefinitionLineEnchanced}</textarea></li>`;
			r += `<li>Copy and create: <code>systemBuilders/pageBuilder${idCodePascal}.js</code>
            <textarea class="codeArea">PageBuilder${idCodePascal}</textarea>
            </li>`;
			r += `<li>Copy and create: <code>systemFileTemplates/fileTemplate_newPage${idCodePascal}.txt</code></li>`;
			r += `<li>Copy and create: <code>systemFileTemplates/fileTemplate_newController${idCodePascal}.txt</code></li>`;
			r += `<li>In <code>system/system.js</code>, paste in these blocks:
            <div><textarea class="codeArea">const PageBuilder${idCodePascal} = require('../systemBuilders/pageBuilder${idCodePascal}');</textarea></div>
            <div><textarea class="codeArea">case '${idCode}':
            return new PageBuilder${idCodePascal}(title, type, kind, data);
            </textarea></div>
            </li>`;
			r += `<li>Then customize the two fileTemplate files to create the new page.</li>`;

			r += `</ul>`;


			// this.formStatus = 'success';
			// this.formMessage = `Data received: <ul><li>dataTypeDefinitionLine = <code>${dataTypeDefinitionLine}</code></li></ul>`;

			this.responseData.htmlContent = qstr.protectStringForHtmlInjection(r);

			this.sendResponse();

		}
	}

	getDataTypeDefinitionLineEnchanced(dataTypeDefinitionLine) {
		const parts = qstr.breakIntoParts(dataTypeDefinitionLine, '[');
		const enhanced = `<h>${parts[0]}</h> <in>nnn</in>[${parts[1]}`;
		return enhanced;
	}



}

module.exports = ControllerCreatePageBuilder