"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const ShowcaseBook = require('../systemItems/showcaseBook');
const dpod = require('../system/dpod');


class ControllerShowcaseBestEcmascript6Features extends Controller {
	constructor(request, response) {
		super(request, response);
		this.lines = [];
	}


	customFormValidation(field, errors) {
		// if (field.idCode == 'title' && qstr.contains(field.value, '.')) {
		//     this.addFormError(field, 'should not contain a period character');
		// }
	}

	action_loadPageData() {
		this.responseStatus = 'loaded';
		this.formTypeDefinitionFieldBlock = `
Feature; choice; $choices = default parameters, template literals, const and let instead of var [constLet], multiline strings, destructuring assignment, *arrow functions; $choiceSelector = radioVertical
        `;
		this.responseData = {};

		this.prepareFields();
		//this.responseData.fields.title.value = `putDefaultValueHere`;
		this.sendResponse();
	}

	addToOutput(text) {
		this.lines.push(text);
	}

	action_processForm() {
		const isValid = this.validateForm();
		if (isValid) {

			const feature = this.getFieldValue('feature');

			const methodName = `feature_${feature}`;


			if (typeof this[methodName] == "function") {
				this[methodName]();
			} else {
				this.addToOutput('todo...');
			}

			let result = qstr.convertLinesToStringBlock(this.lines);
			result = qstr.displayAsHtmlMultiLine(result);
			this.responseData.result = result;

			this.sendResponse();

		}
	}

	feature_defaultParameters() {
		this.addToOutput(this.theBox());
		this.addToOutput(this.theBox(55));
	}

	theBox(width = 5) {
		return width;
	}

	feature_templateLiterals() {
		const first = "Jim";
		const last = "Smythe";
		this.addToOutput(`Your name is ${first} ${last}.`);

		const id = 34;
		this.addToOutput(`http://localhost:3000/api/messages/${id}`);
	}

	feature_multilineStrings() {
		const itemTypeDefinitionBlock = `** Howtos
Category
Title
Body;p
Score;wn
Extras
`;
		this.addToOutput(itemTypeDefinitionBlock);
	}

	feature_constLet() {
		var allowed = true;
		var score = 23;
		if (allowed) {
			var score = 50;
		}
		this.addToOutput(score);

		let age = 23;
		if (allowed) {
			let age = 50;
		}
		this.addToOutput(age);

		const name = "Jim";

		if (allowed) {
			//name = "Joe"; //error
			const name = "Joe";
		}
		this.addToOutput(name);

		const names = [];
		names.push('Kalim');
		this.addToOutput(names[0]);

		const config = {
			title: "News",
			user: "dev"
		}
		config.loggedIn = true;
		this.addToOutput(config.loggedIn);

	}

	feature_destructuringAssignment() {
		let [id, color, name] = this.getProductInfo('23112_bronze_smartphone');
		this.addToOutput(id);
		this.addToOutput(color);
		this.addToOutput(name);
		[id, , name] = this.getProductInfo('02347_silver_smartphone');
		this.addToOutput(id);
		this.addToOutput(name);
		[, color, name] = this.getProductInfo('03422_gold_smartphone');
		this.addToOutput(color);
		this.addToOutput(name);

		this.addToOutput('---');

		const {
			status,
			directory,
			defaultUser,
			hasAdminRights
		} = this.getConfig();
		this.addToOutput(status);
		this.addToOutput(directory);
		this.addToOutput(defaultUser);
		this.addToOutput(hasAdminRights);
	}

	getProductInfo(text) {
		const parts = qstr.breakIntoParts(text, '_');
		return parts;
	}

	getConfig() {
		return {
			status: 'online',
			directory: 'customImages',
			defaultUser: 'dev',
			hasAdminRights: false
		};
	}

	feature_arrowFunctions() {
		this.addToOutput('111');
		const that = this;
		this.getData(8, function (data) {
			that.addToOutput(data);
		});

		this.getData(10, (data) => {
			this.addToOutput(data);
		});
	}
	getData(id, callback) {
		// TODO: callbackStackIssue, this causes a callback stack issue which leads to the problem that one can't pass the result of a callback into another callback, although one does get the result which can then be passed to the front end via AJAX, for instance
		// dpod.fetchItem(`pageItem where id = ${id}`, function (item) {
		//     callback(item.title);
		// });
		this.lookupPerson(id, function (person) {
			callback(`${person.firstName} ${person.lastName}`);
		});
	}

	lookupPerson(id, callback) {
		let person = {};
		switch (id) {
			case 8:
				person = {
					firstName: 'Sandra',
					lastName: 'Kubrachko',
					age: 44
				};
				break;
			case 10:
				person = {
					firstName: 'Joseph',
					lastName: 'Talento',
					age: 44
				};
				break;
		}
		callback(person);
	}

	feature_newDataStructureMaps() {
		this.addToOutput('(TODO)');
	}

	//TODO: map()
	// feature_arrowFunctions() {
	//     var ids = ['5632953c4e345e145fdf2df8', '563295464e345e145fdf2df9']
	//     var messages = ids.map(value => `ID is ${value}`);
	//     console.log(messages);
	// }

}

module.exports = ControllerShowcaseBestEcmascript6Features