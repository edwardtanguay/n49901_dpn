"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const qarr = require('../qtools/qarr');
const ShowcaseBook = require('../systemItems/showcaseBook');
const markdown = require("markdown").markdown;
const RegexParser = require('../systemClasses/regexParser');

class ControllerShowcaseRegexParser extends Controller {
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
			`Pour pouvoir collaborer sur un projet Git, il est nécessaire de savoir comment [gérer;manage] les dépôts distants. Les [dépôts;repositories] distants sont des versions de votre projet qui sont v{hébergées (héberger)} sur Internet ou le n{réseau} d’entreprise. Vous pouvez en avoir plusieurs, pour lesquels vous pouvez avoir des n{droits} soit en lecture seule, soit en lecture/écriture. Collaborer avec d’autres personnes consiste à gérer ces dépôts distants, en poussant ou tirant des n{données} depuis et vers ces dépôts quand vous souhaitez v{partager} votre travail. Gérer des dépôts distants inclut savoir comment ajouter des dépôts distants, effacer des dépôts distants qui ne sont plus valides, gérer des branches distantes et les définir comme suivies ou non, et plus encore. Dans cette section, nous v{traiterons (traiter)} des commandes de gestion distante.`;
		this.sendResponse();
	}

	action_processForm() {
		const isValid = this.validateForm();
		if (isValid) {

			const inputText = this.requestData.fields.inputText.value;

			const regexParser = new RegexParser(inputText);

			regexParser.parse(/(\[.*?\;.*?\])/g, 'flashcard', parts => {
				for (const part of parts) {
					const pieces = part.text.match(/\[(.*?)\;(.*?)\]/);
					part.front = pieces[1];
					part.back = pieces[2];
				}
				return parts;
			});

			regexParser.parse(/(v\{.*?\})/g, 'verb', parts => {
				for (const part of parts) {
					if (qstr.contains(part.text, '(')) {
						// v{hébergées (héberger)}
						const pieces = part.text.match(/v\{(.*?) \((.*?)\)\}/);
						part.verbShow = pieces[1];
						part.verbLookup = pieces[2];
					} else {
						// v{replacer}
						const pieces = part.text.match(/v\{(.*?)\}/);
						part.verbShow = pieces[1];
						part.verbLookup = pieces[1];
					}
					part.url = `http://www.conjugation-fr.com/conjugate.php?verb=${part.verbLookup}`;
				}
				return parts;
			});

			regexParser.parse(/(n\{.*?\})/g, 'noun', parts => {
				for (const part of parts) {
					if (qstr.contains(part.text, '(')) {
						// n{dépôts (dépôt)}
						const pieces = part.text.match(/n\{(.*?) \((.*?)\)\}/);
						part.nounShow = pieces[1];
						part.nounLookup = pieces[2];
					} else {
						// n{réseau}
						const pieces = part.text.match(/n\{(.*?)\}/);
						part.nounShow = pieces[1];
						part.nounLookup = pieces[1];
					}
					part.url = `https://dict.leo.org/franz%C3%B6sisch-deutsch/${part.nounLookup}`;
				}
				return parts;
			});

			this.responseData.vocabularyTerms = this.getVocabularyTerms(regexParser.parts);
			this.responseData.parts = regexParser.parts;
			this.sendResponse();
		}
	}

	getVocabularyTerms(parts) {
		let ra = [];

		// gets all even the undefined fillers
		ra = parts.map(m => {
			switch (m.kind) {
				case 'noun':
					return m.nounShow;
				case 'verb':
					return m.verbShow;
				case 'flashcard':
					return m.front;
			}
		});

		// removes the undefineds
		ra = ra.filter(m => !qstr.isEmpty(m));

		// alphabetize
		ra.sort();

		return ra;
	}

}

module.exports = ControllerShowcaseRegexParser