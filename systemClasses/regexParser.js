"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const fs = require('fs');
const config = require('../system/config');

class RegexParser {

	constructor(text) {
		this.text = text;
		this.parts = [];
	}

	addParts(theText, filteredParts, regex, theParts, idCode) {
		const textPieces = theText.split(regex);
		for (const textPiece of textPieces) {
			const part = {};
			if (regex.test(textPiece)) {
				part.kind = idCode;
				part.text = textPiece;
				filteredParts.push(part);
			} else {
				part.kind = 'filler';
				part.text = textPiece;
			}
			theParts.push(part);
		}
	}

	parse(regex, idCode, callback = null) {
		const filteredParts = [];
		if (this.parts.length == 0) {
			// the first time
			this.addParts(this.text, filteredParts, regex, this.parts, idCode);
		} else {
			// all subsequent times
			const newParts = [];
			for (const part of this.parts) {
				// it's a filler, so reparse it
				if (part.kind == 'filler') {
					// find any number of matches in this filler part, e.g. "This v{is} a "
					this.addParts(part.text, filteredParts, regex, newParts, idCode);
				} else {
					// these are the parts that have already been processed, e.g. flashcards, etc.
					newParts.push(part);
				}
			}
			this.parts = newParts;
		}
		if (callback != null) {
			this.changedFilteredParts = callback(filteredParts);
			const newParts = [];
			for (const part of this.parts) {
				if (part.kind == idCode) {
					newParts.push(filteredParts.shift());
				} else {
					newParts.push(part);
				}
			}
		}
	}

	getParsedText() {
		return this.parsedText;
	}

}

module.exports = RegexParser