/* SYSTEM TOOLS */
var qsys = qsys || {};

qsys.gotoPage = function (pageIdCode) {
	var url = pageIdCode;
	//window.location.href = url;
	//window.location.replace(url);
	document.location.replace(url);
};

qsys.gotoPageAndAllowBackButton = function (pageIdCode) {
	var url = pageIdCode;
	window.location.href = url;
	//window.location.replace(url);
	//document.location.replace(url);
};

qsys.showcaseSearchAndDisplayItemTypeToPage = function (pageItemIdCode) {
	window.history.pushState(stateObj, "", pageItemIdCode);
}

qsys.changeUrl = function (pageIdCode, params, options = { defaultParams: null }, kind = 'push') {
	const variableParts = [];

	if (options.defaultParams == null) {
		for (const key in params) {
			const value = params[key];
			if (!qstr.isEmpty(value)) {
				variableParts.push(key + "=" + value);
			}
		}
	}

	if (options.defaultParams != null) {
		for (const key in params) {
			const value = params[key];
			if (!qstr.isEmpty(value)) {
				const defaultValue = options.defaultParams[key];
				if (options.defaultParams == null || (options.defaultParams != null && value != defaultValue)) {
					variableParts.push(key + "=" + value);
				}
			}
		}
	}

	let fullUrl = '';
	if (variableParts.length > 0) {
		fullUrl = pageIdCode + "?" + variableParts.join("&");
	} else {
		fullUrl = pageIdCode;
	}
	//window.history.pushState("", "", fullUrl);
	const stateObj = {
		foo: "bar",
	};


	if (kind == 'replace') {
		window.history.replaceState("", "", fullUrl);
	} else {
		window.history.pushState(null, null, fullUrl);
	}
	//window.history.pushState(stateObj, "test", fullUrl);
};

qsys.encodeForUrlPassing = function (url) {
	if (qstr.isEmpty(url)) {
		return '';
	}
	let r = url;
	r = qstr.replaceAll(r, '&', '|');
	r = qstr.replaceAll(r, '?', '§');
	r = qstr.replaceAll(r, '#', '°');
	return r;
}

qsys.decodeForUrlPassing = function (url) {
	if (qstr.isEmpty(url)) {
		return '';
	}
	let r = url;
	r = qstr.replaceAll(r, '|', '&');
	r = qstr.replaceAll(r, '§', '?');
	r = qstr.replaceAll(r, '°', '#');
	return r;
}

qsys.getParameterValueFromUrl = function (parameter) {
	const urlParams = new URLSearchParams(window.location.search);
	return qsys.decodeForUrlPassing(urlParams.get(parameter));
}

qsys.getPageAndParametersFromUrl = function (pageIdCode) {
	const fullUrl = window.location.href; //http://localhost:49900/showcaseJavaScriptSorting?visibleFieldList=title,description,....
	// get everything starting with the pageIdCode passed
	const parts = qstr.breakIntoParts(fullUrl, pageIdCode);
	let pageAndParameters = '';
	if (parts.length > 1) {
		pageAndParameters = pageIdCode + parts[1];
	} else {
		pageAndParameters = pageIdCode;
	}
	return pageAndParameters;
}

qsys.getResponse = function (responseObject) {
	return responseObject.data;
}

qsys.scrollToTopOfTextArea = function (elemIdentifier) {
	setTimeout(function () {
		$(elemIdentifier).focus().selectRange(0, 0);
		$(elemIdentifier).scrollTop(1);
	}, 100);
}

/* qstr */
var qstr = qstr || {};

qstr.padZeros = function (num, numZeros) {
	let r = '';
	var n = Math.abs(num);
	var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
	var zeroString = Math.pow(10, zeros).toString().substr(1);
	if (num < 0) {
		r = '-';
	}
	return r + zeroString + n;
};

qstr.randomize = function (array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}


qstr.NEW_LINE = function (numberOfNewLines = 1) {
	const endOfLine = '\n';
	return endOfLine.repeat(numberOfNewLines);
}

qstr.isEmpty = function (line) {
	if (line == null) {
		return true;
	}
	return String(line).trim() == '';
}

qstr.capitalizeFirstLetter = function (line) {
	return line.charAt(0).toUpperCase() + line.slice(1);
}

qstr.breakIntoParts = function (main, delimiter = ',', maximumNumberOfParts = 0) {
	const roughParts = main.split(delimiter);
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
	return parts;
}

qstr.isInList = function (term, termsList) {
	const terms = qstr.breakIntoParts(termsList, ',');
	return terms.includes(term);
}

qstr.trimAllLinesInLinesArray = function (lines) {
	const newLines = [];
	lines.forEach(function (line, index) {
		let newLine = line.trim();
		newLines.push(newLine);
	});
	return newLines;
}

qstr.trimLinesOfEndBlanks = function (lines) {
	lines = qstr.trimBeginningLinesOfBlanks(lines);
	lines = lines.reverse();
	lines = qstr.trimBeginningLinesOfBlanks(lines);
	lines = lines.reverse();
	return lines;
}

qstr.trimBeginningLinesOfBlanks = function (lines) {
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

qstr.convertStringBlockToLines = function (stringBlock, trimLines = true) {
	stringBlock = String(stringBlock);
	roughLines = stringBlock.split("\n");
	if (trimLines) {
		roughLines = qstr.trimAllLinesInLinesArray(roughLines);
		roughLines = qstr.trimLinesOfEndBlanks(roughLines);
	}
	return roughLines;
}

qstr.countLinesInStringBlock = function (stringBlock, trimLines = true) {
	const lines = qstr.convertStringBlockToLines(stringBlock, trimLines);
	return lines.length;
}

qstr.convertLinesToStringBlock = function (lines) {
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

qstr.getIntegerArrayFromList = function (list) {
	const ra = [];
	if (qstr.isEmpty(list)) {
		return ra;
	} else {
		const parts = qstr.breakIntoParts(list, ',');
		for (const part of parts) {
			ra.push(parseInt(part));
		}
		return ra;
	}
}

qstr.internalExternalTrim = function (stringBlock) {
	const newLines = [];
	const lines = qstr.convertStringBlockToLines(stringBlock);
	let numberOfBlanksInRow = 0;
	for (let line of lines) {
		let newLine = line;
		if (qstr.isEmpty(line)) {
			numberOfBlanksInRow++;
			if (numberOfBlanksInRow > 1) {
				continue;
			}
		} else {
			numberOfBlanksInRow = 0;
		}
		newLines.push(newLine);
	}
	return qstr.convertLinesToStringBlock(newLines);
}

qstr.replaceAll = function (text, search, replace) {
	if (text === undefined) {
		return '';
	} else {
		return text.split(search).join(replace);
	}
};

qstr.capitalizeFirstLetter = function (text) {
	if (qstr.isEmpty(text)) {
		return '';
	} else {
		return text.charAt(0).toUpperCase() + text.slice(1);
	}
}

// e.g. "green, red, blue", "red"
qstr.listContainsValue = function (list, value) {
	const parts = qstr.breakIntoParts(list, ',');
	return parts.includes(value);
}

qstr.encodeHtmlForDisplay = function (html) {
	let r = html;
	r = qstr.replaceAll(r, '>', '&gt;');
	r = qstr.replaceAll(r, '<', '&lt;');
	return r;
}

qstr.atLeastOneTermMatchesInLists = function (list1, list2) {
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

qstr.contains = function (line, searchText, options = { caseSensitive: false }) {
	let processLine = line;
	let processSearchText = searchText;
	if (!options.caseSensitive) {
		processLine = processLine.toUpperCase();
		processSearchText = processSearchText.toUpperCase();
	}
	return String(processLine).includes(processSearchText);
}

qstr.smartPlural = function (number, pluralText, singularText = '') {
	let r = '';
	if (singularText == '') {
		singularText = qstr.chopRight(pluralText, 's');
	}
	r += number + ' ';
	if (number == 1) {
		r += singularText;
	} else {
		r += pluralText;
	}
	return r;
}

qstr.chopRight = function (main, textToChop) {
	if (main.endsWith(textToChop)) {
		const len = textToChop.length;
		const mainLen = main.length;
		if (len <= mainLen) {
			return main.substring(0, mainLen - (len));
		}
	}
	return main;
}

/* qobj */
var qmat = qmat || {};
qmat.getRandomNumber = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

qmat.getRandomItemFromArray = function (items) {
	return items[Math.floor(Math.random() * items.length)];
}

/* qobj */
var qobj = qobj || {};
qobj.getObjectLength = function (obj) {
	return Object.keys(obj).length;
}


/* qarr */
var qarr = qarr || {};
qarr.multisort = function (arr, columns, order_by) {
	if (typeof columns == 'undefined') {
		columns = []
		for (x = 0; x < arr[0].length; x++) {
			columns.push(x);
		}
	}

	if (typeof order_by == 'undefined') {
		order_by = []
		for (x = 0; x < arr[0].length; x++) {
			order_by.push('asc');
		}
	}

	function multisort_recursive(a, b, columns, order_by, index) {
		var direction = order_by[index] == 'desc' ? 1 : 0;

		var is_numeric = !isNaN(a[columns[index]] - b[columns[index]]);

		let valueA = a[columns[index]];
		let valueB = b[columns[index]];

		if (valueA == null) {
			valueA = '';
		}
		if (valueB == null) {
			valueB = '';
		}

		var x = is_numeric ? valueA : valueA.toLowerCase();
		var y = is_numeric ? valueB : valueB.toLowerCase();

		if (!is_numeric) {
			x = valueA.toLowerCase(), valueB.toLowerCase();
		}

		if (x < y) {
			return direction == 0 ? -1 : 1;
		}

		if (x == y) {
			return columns.length - 1 > index ? multisort_recursive(a, b, columns, order_by, index + 1) : 0;
		}

		return direction == 0 ? 1 : -1;
	}

	return arr.sort(function (a, b) {
		return multisort_recursive(a, b, columns, order_by, 0);
	});
}

// extensions:

$.fn.selectRange = function (start, end) {
	if (!end) end = start;
	return this.each(function () {
		if (this.setSelectionRange) {
			this.focus();
			this.setSelectionRange(start, end);
		} else if (this.createTextRange) {
			var range = this.createTextRange();
			range.collapse(true);
			range.moveEnd('character', end);
			range.moveStart('character', start);
			range.select();
		}
	});
};