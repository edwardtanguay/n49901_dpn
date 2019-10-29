"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qstr = require('../qtools/qstr');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qarr = require('../qtools/qarr');

class ControllerShowcaseRegex extends Controller {
	constructor(request, response) {
		super(request, response);
	}

	action_loadPageData() {
		this.responseStatus = 'loaded';
		this.responseData = {};

		const htmlAreas = [];
		htmlAreas.push(this.example_makeCapitalizedLettersBold());
		htmlAreas.push(this.example_highlightOccurancesOfWords());
		htmlAreas.push(this.example_highlightKindsOfWordsWithOnlineLinkBasedOnWord());
		htmlAreas.push(this.example_parseDefinitionsAndShowAfterWords());
		htmlAreas.push(this.example_parseDefinitionsAndShowAtEndOfText());

		this.responseData.htmlAreas = htmlAreas;
		this.responseData.smartParts = this.example_parseAsInteractiveFlashcards();
		this.sendResponse();
	}

	example_makeCapitalizedLettersBold() {
		const functionName = 'example_makeCapitalizedLettersBold';
		const regex = /([ÄÖÜßA-Z])/g;
		const regexTemplate = '<b>$1</b>';
		const text = 'GRATIS Lieferung für qualifizerte Erstbestellung nach Deutschland und Österreich.';
		const parsedText = text.replace(regex, regexTemplate);
		return {
			functionName: functionName,
			regexInfos: [regex.toString(), regexTemplate],
			text: text,
			parsedText: parsedText
		};
	}

	example_highlightOccurancesOfWords() {
		const functionName = 'example_highlightOccurancesOfWords';
		const regex = /\b(die|der|das|dem|den|des)\b/gi;
		const regexTemplate = '<span class="highlight">$1</span>';
		const text = 'Bald stellte sich heraus, dass eine durch die Benutzer deaktivierte Bing-Suche die Ursache für dieses Problem war. Abhilfe schafft ein Eingriff in die Registrierung, mit dem die Bing-Suche wieder freigegeben wird. Die nachfolgenden Anweisungen aus einer .reg-Datei beheben bei den meisten Nutzern das Problem.';
		const parsedText = text.replace(regex, regexTemplate);
		return {
			functionName: functionName,
			regexInfos: [regex.toString(), regexTemplate],
			text: text,
			parsedText: parsedText
		};
	}

	example_highlightKindsOfWordsWithOnlineLinkBasedOnWord() {
		const functionName = 'example_highlightKindsOfWordsWithOnlineLinkBasedOnWord';
		const regexNoun = /n\{(.*?)\}/g;
		const regexNounTemplate = '<span class="noun">$1</span>';
		const text = `These n{constructs} v{allow} for a n{.NET regular expression} to v{emulate (emulate)} a restricted n{PDA} by essentially v{allowing (allow)} simple n{versions} of the n{stack operations}. The simple n{operations} v{are (be)} pretty much equivalent to increment and decrement. And now we v{are adding (add)} another one.`;
		let parsedText = text.replace(regexNoun, regexNounTemplate);

		// //prepare new text for second parsing
		/*
'These n{constructs} ',
  'v{allow}',
  ' for a n{.NET regular expression} to ',
  'v{emulate (emulate)}',
  ' a restricted n{PDA} by essentially ',
  'v{allowing (allow)}',
  ' simple n{versions} of the n{stack operations}. The simple n{operations} ',
  'v{are (is)}',
  ' pretty much equivalent to increment and decrement.'
		*/
		const parts = parsedText.split(/(v\{.*?\})/g);
		const fixedParts = [];
		for (const part of parts) {
			let fixedPart = '';
			if (qstr.startsWith(part, `v{`)) {
				if (!qstr.contains(part, '(')) {
					// e.g. 'v{allow}'
					const word = qstr.chopEnds(part, 'v{', '}');
					fixedPart = `v{${word} (${word})}`;
				} else {
					// e.g. 'v{allowing (allow)}'
					fixedPart = part;
				}
			} else {
				fixedPart = part;
			}
			fixedParts.push(fixedPart);
		}
		parsedText = fixedParts.join('');
		console.log(parsedText);

		//second parsing
		const regexVerb = /v\{(.*?)( \((.*?)\))?\}/g;
		const regexVerbTemplate = '<span class="verb"><a target="_blank" href="https://cooljugator.com/en/$3">$1</a></span>';
		//const regexVerbTemplate = '1=$1, 2=$2, 3=$3';
		parsedText = parsedText.replace(regexVerb, regexVerbTemplate);

		return {
			functionName: functionName,
			regexInfos: [regexNoun.toString(), regexNounTemplate, regexVerb.toString(), regexVerbTemplate],
			text: text,
			parsedText: parsedText
		};
	}

	example_parseDefinitionsAndShowAfterWords() {
		const functionName = 'example_parseDefinitionsAndShowAfterWords';
		//const regex = /\[(.*?);(.*?)\]/g;
		const regex = /\[(.*?);(.*?)\]/g;
		const regexTemplate = '<span class="word">$1</span> <span class="meaning">($2)</span>';
		const text = `Qu’est-ce que la [gestion;management] de version et pourquoi devriez-vous vous [en soucier;to worry about] ? Un gestionnaire de version est un système qui enregistre l’évolution d’un fichier ou d’un ensemble de fichiers [au cours du temps;over time] de manière à ce qu'[on puisse rappeler;we can call back] une version antérieure d’un fichier à tout moment.`;
		const parsedText = text.replace(regex, regexTemplate);
		return {
			functionName: functionName,
			regexInfos: [regex.toString(), regexTemplate],
			text: text,
			parsedText: parsedText
		};
	}

	example_parseDefinitionsAndShowAtEndOfText() {
		const functionName = 'example_parseDefinitionsAndShowAtEndOfText';
		const regex = /\[(.*?);(.*?)\]/g;
		const regexMeaning = /\;(.*?)\]/g;
		const regexTemplate = '<span class="word">$1</span>';
		const text = `Qu’est-ce que la [gestion;management] de version et pourquoi devriez-vous vous [en soucier;to worry about] ? Un gestionnaire de version est un système qui enregistre l’évolution d’un fichier ou d’un ensemble de fichiers [au cours du temps;over time] de manière à ce qu'[on puisse rappeler;we can call back] une version antérieure d’un fichier à tout moment.`;
		let parsedText = text.replace(regex, regexTemplate);
		const rawMeanings = text.match(regexMeaning);

		//process (this should be done with regex somehow)
		const meanings = [];
		for (let rawMeaning of rawMeanings) {
			let meaning = rawMeaning;
			meaning = qstr.chopLeft(meaning, ';');
			meaning = qstr.chopRight(meaning, ']');
			meanings.push(meaning);
		}
		qarr.shuffle(meanings);

		// add vocabular
		parsedText += `<div class="vocabularyTestTitle">Find the meaning for each word:</div>`
		for (const meaning of meanings) {
			parsedText += `<div class="meaningListWord">` + meaning + `</div>`;
		}

		return {
			functionName: functionName,
			regexInfos: [regex.toString(), regexTemplate, regexMeaning.toString()],
			text: text,
			parsedText: parsedText
		};
	}

	example_parseAsInteractiveFlashcards() {
		const text = `Par exemple, pour [parcourir;browse] l'historique d'un projet, Git n'a pas besoin d'aller le [chercher;to look] sur un serveur pour vous l'afficher ; il n'a qu'à simplement le lire directement dans votre [base de données;database] locale. [Cela signifie que;This means that] vous avez quasi-instantanément [accès;access] à l'historique du projet.`;
		const regex = /(\[.*?\;.*?\])/g;
		const parts = text.split(regex);
		const smartParts = [];
		/*
[ 'Par exemple, pour ',
  '[parcourir;browse]',
  ' l\'historique d\'un projet, Git n\'a pas besoin d\'aller le chercher sur un serveur pour vous l\'afficher ; il n\'a qu\'à simplement le lire directement dans votre ',
  '[base de données;database]',
  ' locale. ',
  '[Cela signifie que;This means that]',
  ' vous avez quasi-instantanément accès à l\'historique du projet.' ]
		*/
		for (const part of parts) {
			const smartPart = {};
			if (regex.test(part)) {
				smartPart.kind = 'flashcard';
				const sidesOff = qstr.chopEnds(part, '[', ']'); // parcourir;browse
				const pieces = qstr.breakIntoParts(sidesOff, ';');
				smartPart.front = pieces[0];
				smartPart.back = pieces[1];
			} else {
				smartPart.kind = 'filler';
				smartPart.front = '';
				smartPart.back = '';
			}
			smartPart.text = part.trim();
			smartParts.push(smartPart);
		}
		return smartParts;
	}


	// for more, see: https://www.tutorialrepublic.com/javascript-tutorial/javascript-regular-expressions.php

}

module.exports = ControllerShowcaseRegex