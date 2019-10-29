"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const fs = require('fs');
const config = require('../system/config');
const TextChunk = require('../systemTextParsers/textChunk');

// A TextChunkDocument is simply a collection of TextChunks, ready to be fed to the Item Types to define them.

class TextChunkDocument {

	constructor(rawTextDocument) {
		this.paragraphBeginMarker = '[[';
		this.paragraphEndMarker = ']]';
		this.paragraphBlankLineMask = '@@@_BLANK_LINE_MASK_@@@';
		this.rawTextDocument = rawTextDocument;
		this.rawLines = qstr.convertStringBlockToLines(rawTextDocument, false);
		this.lines = qstr.trimLinesOfEndBlanks(this.rawLines);
		this.textChunks = [];
		this.parseStatus = '';
		this.textChunkLines = [];
		this.maskBlankLinesBetweenParagraphMarkers();
		this.parseIntoTextChunks();
		this.parseParagraphMarkers(); //e.g. segments with '[[' and ']]' into one line with \n at the end of each
	}

	maskBlankLinesBetweenParagraphMarkers() {
		const newLines = [];
		let weAreInsideParagraphMarkers = false;
		for (const line of this.lines) {
			let newLine = '';
			if (weAreInsideParagraphMarkers && qstr.isEmpty(line)) {
				newLine = this.paragraphBlankLineMask;
			} else {
				newLine = line;
			}

			// the line could either be "description::[[" or "[["			
			//if (qstr.isEqual(line.trim(), this.paragraphBeginMarker)) {
			if (qstr.endsWith(line.trim(), this.paragraphBeginMarker)) {
				weAreInsideParagraphMarkers = true;
			}
			if (qstr.isEqual(line.trim(), this.paragraphEndMarker)) {
				weAreInsideParagraphMarkers = false;
			}
			newLines.push(newLine);
		}
		this.lines = newLines;
	}

	parseParagraphMarkers() {
		for (const textChunk of this.textChunks) {
			textChunk.parseParagraphMarkers();
		}
	}

	getDebuggingInfos() {
		return {
			'numberOfLines': this.lines.length,
		};
	}

	numberOfTextChunks() {
		return this.textChunks.length;
	}

	parseIntoTextChunks() {
		this.parseStatus = 'recordingText';
		this.textChunkLines = [];
		for (const line of this.lines) {
			if (this.parseStatus == 'searchingForText' && !qstr.isEmpty(line)) {
				this.parseStatus = 'recordingText';
			}
			if (this.parseStatus == 'recordingText' && qstr.isEmpty(line)) {
				this.recordTextChunk();
				continue;
			}
			if (this.parseStatus == 'recordingText' && !qstr.isEmpty(line)) {
				this.textChunkLines.push(line);
				continue;
			}
		}
		if (this.textChunkLines.length > 0) {
			this.recordTextChunk();
		}
	}

	recordTextChunk() {
		const textChunk = new TextChunk(this.textChunkLines);
		textChunk.paragraphBeginMarker = this.paragraphBeginMarker;
		textChunk.paragraphEndMarker = this.paragraphEndMarker;
		textChunk.paragraphBlankLineMask = this.paragraphBlankLineMask;
		this.textChunks.push(textChunk);
		this.parseStatus = 'searchingForText';
		this.textChunkLines = [];
	}

	renderAsHtml() {
		let html = '';

		for (const textChunk of this.textChunks) {
			html += textChunk.renderAsHtml();
		}
		html += `<div class="clear"></div>`;
		return html;
	}

}

module.exports = TextChunkDocument