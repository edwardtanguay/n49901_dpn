const qstr = require('../qtools/qstr');
const qdev = require('../qtools/qdev');
const qmat = require('../qtools/qmat');
const Choice = require('../systemClasses/choice.js');
const Markdown = require("markdown").markdown;
const OutlineTextParser = require('../systemTextParsers/outlineTextParser');
const config = require('../system/config');

exports.NEW_LINE = function (numberOfNewLines = 1) {
	const endOfLine = '\n';
	return endOfLine.repeat(numberOfNewLines);
}

exports.TAB = function (numberOfTabs = 1) {
	const tab = "    "; // 4 spaces
	return tab.repeat(numberOfTabs);
}

exports.tabs = function (number) {
	const tab = qstr.TAB();
	return tab.repeat(number);
}

exports.chopLeft = function (main, textToChop) {
	if (main.startsWith(textToChop)) {
		const len = textToChop.length;
		const mainLen = main.length;
		if (len <= mainLen) {
			return main.substring(len, mainLen);
		}
	}
	return main;
}

exports.chopRight = function (main, textToChop) {
	if (main.endsWith(textToChop)) {
		const len = textToChop.length;
		const mainLen = main.length;
		if (len <= mainLen) {
			return main.substring(0, mainLen - (len));
		}
	}
	return main;
}

// also does full trim, of array and each line
exports.convertStringBlockToLines = function (stringBlock, trimLines = true) {
	if (qstr.isEmpty(stringBlock)) {
		return [];
	}
	roughLines = stringBlock.split("\n");
	if (trimLines) {
		roughLines = qstr.trimAllLinesInLinesArray(roughLines);
	}
	roughLines = qstr.trimLinesOfEndBlanks(roughLines);
	return roughLines;
}
exports.convertStringBlockToLinesNoTrim = function (stringBlock) {
	return qstr.convertStringBlockToLines(stringBlock, false);
}

// returns a lines array that has front and end blank strings, as one without these blanks
exports.trimLinesOfEndBlanks = function (lines) {
	lines = qstr.trimBeginningLinesOfBlanks(lines);
	lines = lines.reverse();
	lines = qstr.trimBeginningLinesOfBlanks(lines);
	lines = lines.reverse();
	return lines;
}

// if first line of lines array is blank, it will remove it
// but don't remove any blank lines from middle or end
exports.trimBeginningLinesOfBlanks = function (lines) {
	const newLines = [];
	let trimmingBlanks = true;
	lines.forEach(function (line, index) {
		let newLine = line;
		if (trimmingBlanks && line == "") {
			//skip it since it is a preceding blank item
		} else {
			newLines.push(newLine);
			trimmingBlanks = false;
		}
	});
	return newLines;
}

exports.trimAllLinesInLinesArray = function (lines) {
	const newLines = [];
	lines.forEach(function (line, index) {
		let newLine = line.trim();
		newLines.push(newLine);
	});
	return newLines;
}

exports.removeLineInLinesByIndex = function (lines, indexToRemove) {
	const newLines = [];
	lines.forEach(function (line, index) {
		let newLine = line.trim();
		if (index != indexToRemove) {
			newLines.push(newLine);
		}
	});
	return newLines;
}

exports.breakIntoParts = function (main, delimiter = ',', maximumNumberOfParts = 0) {
	const escapedDelimiter = '\\' + delimiter;
	const mask = `@@@MASK@@@`;
	if (qstr.isEmpty(main)) {
		return [];
	}

	const maskedMain = qstr.replaceAll(main, escapedDelimiter, mask);
	const roughParts = maskedMain.split(delimiter);
	let parts = [];
	roughParts.forEach(function (part) {
		let newPart = part;
		newPart = newPart.trim();
		parts.push(newPart);
	});
	if (maximumNumberOfParts != 0 && maximumNumberOfParts < parts.length) {
		const consolidatedParts = [];
		parts.forEach(function (part, index) {
			if (index < maximumNumberOfParts - 1) {
				consolidatedParts.push(part);
			} else {
				let current = consolidatedParts[maximumNumberOfParts - 1];
				let prefix = "";
				if (current != undefined) {
					prefix = current + ";"
				}
				consolidatedParts[maximumNumberOfParts - 1] = prefix + part;
			}
		});
		parts = consolidatedParts;
	}

	//unmask
	const unmaskedParts = [];
	for (const part of parts) {
		const unmaskedPart = qstr.replaceAll(part, mask, delimiter);
		unmaskedParts.push(unmaskedPart);
	}
	parts = unmaskedParts;

	return parts;
}

exports.insertSpaceBeforeEveryUppercaseCharacter = function (term) {
	let r = '';
	const forCheckingTerm = term + ' ';
	for (let i = 0; i < term.length; i++) {
		const character = forCheckingTerm.charAt(i);
		const characterAfter = forCheckingTerm.charAt(i + 1);
		if (qstr.isUppercaseLetter(character)) {
			r += ' ';
		}
		r += character;
	}
	r = qstr.forceAllMultipleSpacesToSingleSpace(r);
	return r;
}

exports.forceAllMultipleSpacesToSingleSpace = function (term) {
	return term.replace(/(\s)+/g, ' ');
}

exports.forceTextNotation = function (term) {
	let r = term;

	r = r.trim();

	// if is all caps like "FIRST ANNUAL REPORT" then we don't want "F I R S T   A N N U A L   R E P O R T"
	// but "first annual report"
	if (qstr.isAllUppercase(r)) {
		r = r.toLowerCase();
	}
	r = qstr.insertSpaceBeforeEveryUppercaseCharacter(r);

	// now lowercase everything
	r = r.toLowerCase();

	r = r.trim();

	return r;
}

exports.isUppercaseLetter = function (character) {
	const regex = new RegExp("[A-Z]");
	return character.length === 1 && regex.test(character);
}

exports.isLowercaseLetter = function (character) {
	const regex = new RegExp("[a-z]");
	return character.length === 1 && regex.test(character);
}

exports.isAllUppercase = function (term) {
	if (term.toUpperCase() == term) {
		return true;
	} else {
		return false;
	}
}


exports.lowercaseFirstLetter = function (term) {
	return term.charAt(0).toLowerCase() + term.slice(1);
}

exports.renderEnglishTitleCapitalization = function (term) {
	let r = term;

	const termsToLowercase = ['A', 'An', 'The', 'Or', 'And', 'Of', 'For', 'With', 'Into', 'From'];

	//mask
	termsToLowercase.forEach(function (termToLowerCase) {
		const searchText = ': ' + termToLowerCase + ' ';
		const replaceText = ':@' + termToLowerCase + ' ';
		r = r.replace(searchText, replaceText);
	});

	termsToLowercase.forEach(function (termToLowerCase) {
		const searchText = ' ' + termToLowerCase + ' ';
		const replaceText = searchText.toLowerCase();
		r = r.replace(searchText, replaceText);
	});

	//unmask
	termsToLowercase.forEach(function (termToLowerCase) {
		const searchText = ':@' + termToLowerCase + ' ';
		const replaceText = ': ' + termToLowerCase + ' ';
		r = r.replace(searchText, replaceText);
	});
	return r;
}

// Forces a string to be in title notation, e.g. First Name.
exports.forceTitleNotation = function (term) {
	let r = term;

	//it is a one-word acronym like "UPS", then just keep it that way
	if (qstr.isAllUppercase(r) && !r.includes(' ')) {
		return r;
	} else {
		r = term;
		//if at this point we have e.g. "THIS IS A GOOD THING", then lowercase it first here
		if (qstr.isAllUppercase(r)) {
			r = r.toLowerCase();
		}

		//get the text notation, e.g. "first name"
		const textNotation = qstr.forceTextNotation(r);

		//now uppercase the first letter of each word
		const words = qstr.breakIntoParts(textNotation, ' ');

		r = '';
		words.forEach(function (word) {
			r += qstr.capitalizeFirstLetter(word).trim() + ' ';
		});

		r = r.trim();

		// handle the punctuation rules for English, lowercase prepositions and articles under 7 letters
		r = qstr.renderEnglishTitleCapitalization(r);

	}
	return r;
}

exports.forceCapitalizeFirstCharacterOfEveryWord = function (term) {
	let r = '';
	const words = qstr.breakIntoParts(term, ' ');
	if (words.length > 0) {
		words.forEach(function (word) {
			r += qstr.capitalizeFirstLetter(word);
		});
		r = r.trim();
	}
	return r;
}

// "Project 1: The Book Sections" => "Project 1 The Book Sections"
// "Die fröhliche Wissenschaft" => "Die froehliche Wissenschaft"
exports.cleanForCamelAndPascalNotation = function (term) {
	let r = term;
	r = qstr.convertForeignCharactersToStandardAscii(r);
	r = r.replace(/[^A-Za-z1-9 ]/g, '');
	return r;
}

// "Die fröhliche Wissenschaft" => "Die froehliche Wissenschaft"
exports.convertForeignCharactersToStandardAscii = function (term) {
	let r = term;
	//French
	r = r.replace('è', 'e');
	r = r.replace('à', 'e');
	r = r.replace('ê', 'e');
	//todo: add more that you need, with tests

	//German
	r = r.replace('ö', 'oe');
	r = r.replace('ß', 'ss');
	r = r.replace('ü', 'ue');
	r = r.replace('ä', 'ae');
	r = r.replace('Ö', 'OE');
	r = r.replace('Ü', 'UE');
	r = r.replace('Ä', 'AE');
	return r;
}

exports.forcePascalNotation = function (term) {
	let r = String(term);

	// exceptions
	if (r.toLowerCase() == 'id-code') {
		return 'IdCode';
	}

	r = qstr.cleanForCamelAndPascalNotation(r);

	//convert to "First Name"
	r = qstr.forceTitleNotation(r);

	//force EVERY word to be uppercase, as it may be here "Save and Close"
	r = qstr.forceCapitalizeFirstCharacterOfEveryWord(r);

	//now simply take all spaces out
	r = r.replace(" ", "");

	return r;
}

exports.forceCamelNotation = function (term) {
	let r = term;

	//specials
	r = r == 'ID-Code' ? 'id code' : r;

	//first change all e.g. "single-page" to "single page"
	r = qstr.replaceAll(r, '-', ' ');

	//if it is all uppercase (e.g. FAQ) then we want all lower case (faq) and not (fAQ) 
	if (qstr.isAllUppercase(r)) {
		r = r.toLowerCase();
	} else {

		//get the pascal notation first
		const pascalNotation = qstr.forcePascalNotation(r);

		//now lowercase the first character
		r = qstr.lowercaseFirstLetter(pascalNotation);
	}

	return r;
}

exports.isEmpty = function (line) {
	if (line == undefined || line == null) {
		return true;
	} else {
		line = line.toString();
		if (line.trim() == '') {
			return true;
		} else {
			return false;
		}
	}

}

// e.g. "load_pageItems(all)"
exports.getFunctionAndParameterLine = function (line) {
	let ra = [];
	if (line.includes('(')) {
		const parts = qstr.breakIntoParts(line, '(');
		ra.push(parts[0]);
		ra.push(qstr.chopRight(parts[1], ')'));
	} else {
		ra.push(line);
		ra.push('');
	}
	return ra;
}

exports.IsAffirmative = function (text) {
	return ['true', 'yes'].includes(text);
}

exports.atLeastOneTermMatchesInLists = function (list1, list2) {
	const list1Terms = qstr.breakIntoParts(list1);
	const list2Terms = qstr.breakIntoParts(list2);
	for (const list1Term of list1Terms) {
		for (const list2Term of list2Terms) {
			if (list1Term == list2Term) {
				return true;
			}
		}
	}
	return false;
}


exports.isInteger = function (text) {
	const num = parseInt(text);
	if (String(num) != text) {
		return false;
	}
	if (num === parseInt(num, 10)) {
		return true;
	} else {
		return false;
	}
}

// removes everyone but alphanumeric, no spaces
exports.projectSqlValue = function (text) {
	return text.replace(/[^0-9a-z]/gi, '');
}

// returns the index of an array (parts), if doesn't exist, then empty string
exports.getSafePart = function (parts, index) {
	if (parts.length < index + 1) {
		return '';
	} else {
		return parts[index];
	}
}

exports.replaceAll = function (text, search, replace) {
	text = qstr.forceAsString(text);
	return text.split(search).join(replace);
}

exports.forceAsString = function (stringOrOther) {
	if (!qstr.isString(stringOrOther)) {
		return String(stringOrOther);
	} else {
		return stringOrOther;
	}
}

exports.replaceAllRegex = function (text, search, replace) {
	if (replace === undefined) {
		return text;
	}
	return text.replace(new RegExp(search, 'g'), replace);
};




exports.getNumberOfPrecedingTabs = function (text, forceRealTabs = false) {
	let tempText = text;
	let numberOfPrecedingTabs = 0;
	let tab = qstr.TAB();
	if (forceRealTabs) {
		tab = '\t';
	}
	while (tempText.startsWith(tab)) {
		tempText = qstr.chopLeft(tempText, tab);
		numberOfPrecedingTabs++;
	}
	return numberOfPrecedingTabs;
};

exports.addPrecedingTabs = function (text, numberOfPrecedingTabs) {
	const tab = qstr.TAB();
	return tab.repeat(numberOfPrecedingTabs) + text;
}


exports.convertLinesToStringBlock = function (lines) {
	let r = '';
	let index = 0;
	for (const line of lines) {
		r += line;
		if (index != lines.length - 1) {
			r += qstr.NEW_LINE();
		}
		index++;
	}
	return r;
}

// e.g. "//DYNAMIC_CODE_AREA:loadTools", return "loadTools"
exports.getRestAfterMarker = function (text, marker) {
	const parts = qstr.breakIntoParts(text, marker);
	if (parts.length > 1) {
		return parts[1];
	}
}
// e.g. "const temp = 2; //:temp", return "const temp = 2;"
exports.stripEndingMarker = function (text, marker) {
	const parts = qstr.breakIntoParts(text, marker);
	if (parts.length > 0) {
		return parts[0];
	}
}

exports.removeEndMarkerAndGetNumberOfPrecedingTabsAndLine = function (line, marker) {
	const numberOfPrecedingTabs = qstr.getNumberOfPrecedingTabs(line);
	let newLine = qstr.chopLeft(line, qstr.tabs(numberOfPrecedingTabs));
	newLine = qstr.stripEndingMarker(newLine, marker);
	return [numberOfPrecedingTabs, newLine];
}

exports.isString = function (obj) {
	if (typeof obj === 'string' || obj instanceof String) {
		return true;
	} else {
		return false;
	}
}

exports.isArray = function (obj) {
	if (Array.isArray(obj)) {
		return true;
	} else {
		return false;
	}
}

exports.addLinesToLines = function (lines1, lines2) {
	const lines = lines1;
	for (const line of lines2) {
		lines.push(line);
	}
	return lines;
}

exports.convertUrlsToLinkableUrls = function (inputText) {
	var replacedText, replacePattern1, replacePattern2, replacePattern3;

	replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
	replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

	replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
	replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

	return replacedText;
}


// exports.capitalizeFirstLetter = function (term) {
//     if (qstr.isEmpty(term)) {
//         return "111";
//     }
//     return '222';
//     //return term.charAt(0).toUpperCase() + term.slice(1);
// }

exports.capitalizeFirstLetter = function (line) {
	if (qstr.isEmpty(line)) {
		return "";
	}
	return line.charAt(0).toUpperCase() + line.slice(1);
}

// "Paperback|Hardcover*|E-Book(ebook)"
exports.convertChoicesListToChoices = function (choicesList) {
	let ra = [];
	const choiceLines = qstr.breakIntoParts(choicesList, '|');
	for (const choiceLine of choiceLines) {
		const choice = new Choice(choiceLine);
		ra.push(choice);
	}
	return ra;
}

exports.getSmartPart = function (parts, index, defaultValue = '') {
	if (parts.length < index + 1) {
		return defaultValue;
	} else {
		return parts[index];
	}
}


// TODO: WRITE TESTS FOR THE FOLLOWING

exports.contains = function (line, searchText) {
	const compareLine = String(line).toUpperCase();
	const searchTextCompare = String(searchText).toUpperCase();
	return compareLine.includes(searchTextCompare);
}


//$choices=Yes, please send it to me.|No, please don't send it to me.|I'll decide later; $required; $info=Remember, you can unsubscribe at any time.; $default=no
exports.parseExtras = function (extras) {
	const parts = qstr.breakIntoParts(extras, ';');
	const extrasObject = {};
	for (const part of parts) {
		const pieces = qstr.breakIntoParts(part, '=');

		// idCode
		const idCodePiece = pieces[0]; // $choices
		const idCode = qstr.chopLeft(idCodePiece, '$');

		// value
		let value = '';
		if (pieces.length > 1) {
			value = pieces[1];
		} else {
			value = true;
		}

		extrasObject[idCode] = value;

	}
	return extrasObject;
}

//TODO: rename to extrasObject
exports.parseDataTypeExtras = function (extras) {
	//mask protected characters
	extras = qstr.replaceAll(extras, `~=`, `~EQUALS~`);
	const oldObjectExtras = qstr.parseExtras(extras);

	//CONVERSIONS
	if (oldObjectExtras.choices) {
		oldObjectExtras.choicesList = oldObjectExtras.choices;
		oldObjectExtras.choices = null;
	}

	const objectExtras = {};
	for (const key in oldObjectExtras) {
		const oldObjectExtra = oldObjectExtras[key];

		// special cases
		if (key == 'required' && oldObjectExtra == 'false') {
			objectExtras[key] = false;
		} else if (key == 'required' && oldObjectExtra == 'true') {
			objectExtras[key] = true;
		} else if (key == 'choicesList' && qstr.contains(oldObjectExtra, ',') && !qstr.contains(oldObjectExtra, '|')) {
			objectExtras[key] = qstr.replaceAll(oldObjectExtra, ',', '|');
		} else {
			objectExtras[key] = oldObjectExtra;
		}
	}

	// FORCE DEFAULTS
	if (!objectExtras.required) {
		objectExtras.required = false;
	}
	if (!objectExtras.displayStatus) {
		objectExtras.displayStatus = 'show';
	}

	//unmask protected characters
	if (objectExtras.info) {
		objectExtras.info = qstr.replaceAll(objectExtras.info, `~EQUALS~`, `=`);
	}

	return objectExtras;
}

exports.getDefaultChoice = function (choices) {
	for (const choice of choices) {
		if (choice.default) {
			return choice.idCode;
		}
	}
	return '';
}

exports.getNumberOfOccurancesInString = function (line, search) {
	var rgxp = new RegExp(search, "g");
	return (line.match(rgxp) || []).length;
}

exports.protectStringForHtmlInjection = function (line) {
	//TODO: add any other protections needed
	return line.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<span style="color:red">(SCRIPT BLOCKED)</span>');
}

// convert quarterReports to quarterReport
exports.forceSingular = function (potentialPluralNotation) {
	return qstr.chopRight(potentialPluralNotation, 's');
}
// convert quarterReport to quarterReports
exports.forcePlural = function (potentialSingularNotation) {
	if (!qstr.endsWith(potentialSingularNotation, 's')) {
		return potentialSingularNotation + 's';
	} else {
		return potentialSingularNotation;
	}
}


exports.getAllPropertyNames = function (o) {
	const acc = Object.create(null)

	for (let oProto = o, aProto = acc; oProto !== null; oProto = Object.getPrototypeOf(oProto), aProto = aProto.__proto__) {
		for (const key of Object.getOwnPropertyNames(oProto)) {
			aProto[key] = oProto[key]
		}

		if (Object.getPrototypeOf(oProto) !== null) {
			aProto.__proto__ = Object.create(null)
		}
	}

	return acc
}

exports.convertStringBlockToLinesRetainLeadingTabs = function (stringBlock) {
	return qstr.convertStringBlockToLines(stringBlock, false);
}

exports.startsWith = function (main, part) {
	if (!qstr.isEmpty(main)) {
		return main.startsWith(part);
	} else {
		return false;
	}
}

exports.smartPlural = function (number, singularText, pluralText) {
	let r = '';
	r += number + ' ';
	if (number == 1) {
		r += singularText;
	} else {
		r += pluralText;
	}
	return r;
}


exports.endsWith = function (main, part) {
	return main.endsWith(part);
}

exports.getBatchImportBlockMarker = function (line) {
	return line.substring(0, 2);
}

exports.displayObjectNice = function (object) {
	let r = '';
	for (const key in object) {
		const value = object[key];
		r += qstr.NEW_LINE(2) + key.toUpperCase() + ' = [' + value + ']';
	}
	r += qstr.NEW_LINE(2);
	return r;
}

exports.objectHasKey = function (object, key) {
	if (key in object) {
		return true;
	} else {
		return false;
	}
}

exports.isEqual = function (text1, text2) {
	if (text1.trim() == text2.trim()) {
		return true;
	} else {
		return false;
	}
}

exports.displayAsHtmlMultiLine = function (text) {
	let r = text;
	r = qstr.replaceAll(r, qstr.NEW_LINE(), '<br/>');
	r = qstr.replaceAll(r, '\t', '&nbsp;&nbsp;&nbsp;&nbsp;');
	return r;
}

exports.parseMarkDown = function (markdownText, options = { suppressParagraphMarks: false, suppressOrderedListElements: false }) {
	let r = markdownText;

	if (options.suppressOrderedListElements) {
		r = qstr.maskText(r, '.');
	}

	r = Markdown.toHTML(r);
	if (options.suppressParagraphMarks) {
		r = qstr.chopLeft(r, '<p>');
		r = qstr.chopRight(r, '</p>');
	}

	if (options.suppressOrderedListElements) {
		r = qstr.unmaskText(r, '.');
	}
	return r;
}

exports.maskText = function (contents, textToMask) {
	let r = contents;
	const maskedText = '§12345§' + textToMask + '§54321§';
	r = qstr.replaceAll(r, textToMask, maskedText);
	return r;
}

exports.unmaskText = function (contents, textToMask) {
	let r = contents;
	r = qstr.replaceAll(r, '§12345§', '');
	r = qstr.replaceAll(r, '§54321§', '');
	return r;
}

//highlightedDateLines: true = dates like 2019-11-10 alone on line will be highlighted
exports.parseOutline = function (outlineText, itemTypeIdCode = '', options = null) {
	const outlineTextParser = new OutlineTextParser(outlineText);
	const imageDirectory = itemTypeIdCode == '' ? 'general' : itemTypeIdCode;
	outlineTextParser.relativePublicImageDirectory = 'customImages/' + imageDirectory;
	outlineTextParser.parse(options);
	return outlineTextParser.displayParsed();
}

exports.isInList = function (term, termsList) {
	const terms = qstr.breakIntoParts(termsList, ',');
	return terms.includes(term);
}

exports.isInLines = function (lines, text) {
	for (const line of lines) {
		if (line.includes(text)) {
			return true;
		}
	}
	return false;
}

exports.encodeHtmlForDisplay = function (html) {
	let r = html;
	r = qstr.replaceAll(r, '>', '&gt;');
	r = qstr.replaceAll(r, '<', '&lt;');
	return r;
}

exports.convertBeginningSpacesToTabs = function (line) {
	let beginningSpaces, restOfLine;
	[beginningSpaces, restOfLine] = qstr.splitBeginningSpacesFromLine(line);
	const beginningPart = qstr.replaceAll(beginningSpaces, '    ', '\t');
	const finishedLine = beginningPart + restOfLine;
	return finishedLine;
}

exports.splitBeginningSpacesFromLine = function (line) {
	let beginningSpaces = '';
	for (var i = 0; i < line.length; i++) {
		const c = line.charAt(i);
		if (c == ' ') {
			beginningSpaces += c;
		} else {
			break;
		}
	}
	const restOfLine = qstr.chopLeft(line, beginningSpaces);
	return [beginningSpaces, restOfLine];
}

exports.repeat = function (text, numberOfTimes) {
	return text.repeat(numberOfTimes);
}

exports.convertLineBreaksAndEncodeToHtml = function (text) {
	let r = text;

	r = qstr.replaceAll(r, qstr.NEW_LINE(), '§NEWLINE§'); //mask
	//r = qstr.encodeHtmlForDisplay(r);
	r = qstr.replaceAll(r, '§NEWLINE§', '<br/>'); //unmask
	return r;
}

// use the right slashes in the absolute path string, e.g. either windows or linux
// absolute path e.g. "public|customImages|dpnVersionFeatures|"
exports.getSmartAbsolutePath = function (maskedAbsolutePath) {
	const slash = config.operatingSystem() == 'linux' ? '/' : '\\';
	const absolutePath = qstr.replaceAll(maskedAbsolutePath, '|', slash);
	return absolutePath;
}

exports.padZeros = function (num, numZeros) {
	var n = Math.abs(num);
	var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
	var zeroString = Math.pow(10, zeros).toString().substr(1);
	return zeroString + n;
};

exports.areEqual = function (text1, text2) {
	return text1.trim() == text2.trim();
}

// e.g. - im [intranet](http://intranet/index.php)
exports.containsUrlMarkdown = function (text) {
	if (qstr.contains(text, '(') && qstr.contains(text, ')') && qstr.contains(text, '[') && qstr.contains(text, ']')) {
		return true;
	} else {
		return false;
	}
}

exports.linesContainCode = function (lines) {
	let rb = false;
	if (qstr.contains(lines, '{') || qstr.contains(lines, '}') || qstr.contains(lines, '/&gt;') || qstr.contains(lines, '&lt;/')) {
		rb = true;
	}
	if (lines.length == 1 && qstr.endsWith(lines[0], ';')) {
		rb = true;
	}
	return rb;
}

exports.convertRankToHtmlStars = function (rank) {
	//const decimalRank = rank.toFixed();
	//return '<i class="fa fa-star"></i> <i class="fa fa-star-o"></i> <i class="fa fa-star-half-o"></i>';
	const fullStar = '<i class="fa fa-star"></i>';
	const halfStar = '<i class="fa fa-star-half-o"></i>';
	const emptyStar = '<i class="fa fa-star-o"></i>';
	if (rank == 5.0) {
		return fullStar + fullStar + fullStar + fullStar + fullStar;
	} else if (rank >= 4.5) {
		return fullStar + fullStar + fullStar + fullStar + halfStar;
	} else if (rank >= 4.0) {
		return fullStar + fullStar + fullStar + fullStar + emptyStar;
	} else if (rank >= 3.5) {
		return fullStar + fullStar + fullStar + halfStar + emptyStar;
	} else if (rank >= 3.0) {
		return fullStar + fullStar + fullStar + emptyStar + emptyStar;
	} else if (rank >= 2.5) {
		return fullStar + fullStar + halfStar + emptyStar + emptyStar;
	} else if (rank >= 2.0) {
		return fullStar + fullStar + emptyStar + emptyStar + emptyStar;
	} else if (rank >= 1.5) {
		return fullStar + halfStar + emptyStar + emptyStar + emptyStar;
	} else if (rank >= 1.0) {
		return fullStar + emptyStar + emptyStar + emptyStar + emptyStar;
	} else if (rank >= 0.5) {
		return halfStar + emptyStar + emptyStar + emptyStar + emptyStar;
	} else {
		return emptyStar + emptyStar + emptyStar + emptyStar + emptyStar;
	}
}

exports.removeFirstLineOfStringBlock = function (stringBlock) {
	let lines = qstr.convertStringBlockToLines(stringBlock);
	lines.shift();
	const r = qstr.convertLinesToStringBlock(lines);
	return r;
}

exports.chopEnds = function (text, chopLeftText, chopRightText) {
	let r = text;
	r = qstr.chopLeft(r, chopLeftText);
	r = qstr.chopRight(r, chopRightText);
	return r;
}

exports.regexCheck = function (line, regexText) {
	const regex = new RegExp(regexText);
	return regex.test(line);
}


exports.getSubstringAsNumber = function (line, start, end) {
	const stringNumber = line.substring(start, end);
	if (qmat.isInteger(stringNumber)) {
		return qmat.forceInteger(stringNumber);
	} else {
		return null;
	}
}

exports.forceAsInteger = function (string) {
	return parseInt(string);
}

exports.forceAsDecimal = function (string) {
	return parseFloat(string);
}

exports.getNumberOfWordsInLine = function (line) {
	const matches = line.match(/[\w\d\’\'-]+/gi);
	return matches ? matches.length : 0;
}

exports.getTextBeforeMarker = function (line, marker) {
	if (line.length > 0) {
		const parts = qstr.breakIntoParts(line, marker);
		return parts[0];
	} else {
		return '';
	}
}

exports.getTextAfterMarker = function (line, marker) {
	if (line.length > 0) {
		const parts = qstr.breakIntoParts(line, marker);
		if (parts.length > 1) {
			return parts[1];
		} else {
			return '';
		}
	} else {
		return '';
	}
}

exports.getLastPart = function (main, delimiter) {
	const parts = qstr.breakIntoParts(main, delimiter);
	return qstr.getLastItemInArray(parts);
}

exports.getLastItemInArray = function (parts) {
	if (parts.length != 0) {
		return parts[parts.length - 1];
	} else {
		return '';
	}
}

exports.linkify = function (inputText) {
	var replacedText, replacePattern1, replacePattern2, replacePattern3;

	//URLs starting with http://, https://, or ftp://
	replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
	replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

	//URLs starting with "www." (without // before it, or it'd re-link the ones done above).
	replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
	replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

	//Change email addresses to mailto:: links.
	replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
	replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

	return replacedText;
}