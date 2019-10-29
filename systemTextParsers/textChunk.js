"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const fs = require('fs');
const config = require('../system/config');

// A TextChunk is simply a "bag of lines," but abstracts away multiline paragraph fields.

class TextChunk {

	constructor(rawLines) {
		this.rawLines = rawLines;
		this.lines = qstr.trimLinesOfEndBlanks(rawLines);
		this.paragraphBeginMarker = '';
		this.paragraphEndMarker = '';
		this.paragraphBlankLineMask = '';
	}

	renderAsHtml() {
		let html = '';
		if (this.lines.length > 0) {
			html += `<div class="textChunk">`;
			html += `<table>`;
			let count = 1;
			for (const line of this.lines) {
				html += `<tr>`;
				html += `<td class="lineNumber">${count}</td>`;
				html += `<td class="lineValue">${qstr.displayAsHtmlMultiLine(line)}</td>`;
				html += `</tr>`;
				count++;
			}
			html += `</table>`;
			html += `</div>`;
		}
		return html;
	}

	// parse these:
	//[[
	//line 1
	//line 2
	//line 3
	//]]

	/*
	IT COULD ALSO LOOK LIKE THIS:
	==testServer
	id::2
	idCode::server1
	title::Server 1
	description::[[
	This is the server info.
	]]
	numberOfDirectories::1
	*/
	parseParagraphMarkers() {
		const newLines = [];
		let parsingParagraph = false;
		let paragraphLines = [];
		let possibleFieldLabelPrefix = ''; // e.g. this could be e.g. "description::" from a "description::[[" line
		for (let line of this.lines) {

			if (line == this.paragraphBlankLineMask) {
				line = '';
			}

			// the line could either be "description::[[" or "[["
			//if (line.trim() == this.paragraphBeginMarker) {
			if (qstr.endsWith(line.trim(), this.paragraphBeginMarker)) {
				possibleFieldLabelPrefix = qstr.chopRight(line.trim(), this.paragraphBeginMarker);
				parsingParagraph = true;
				continue;
			}
			if (line.trim() == this.paragraphEndMarker) {
				const newLine = possibleFieldLabelPrefix + paragraphLines.join(qstr.NEW_LINE());
				possibleFieldLabelPrefix = ''; // reset it
				newLines.push(newLine);
				parsingParagraph = false;
				paragraphLines = [];
				continue;
			}
			if (parsingParagraph) {
				const newLine = line;
				paragraphLines.push(newLine);
			} else {
				newLines.push(line);
			}
		}
		this.lines = newLines;
	}

	getOriginalBatchText() {
		return qstr.convertLinesToStringBlock(this.rawLines);
	}

}

module.exports = TextChunk