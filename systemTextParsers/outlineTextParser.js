"use strict"
const qstr = require('../qtools/qstr');
const qdev = require('../qtools/qdev');
const TextParser = require('./textParser');
const TextParserLine = require('./textParserLine');
const config = require('../system/config');
const _ = require('lodash');

class OutlineTextParser extends TextParser {
	constructor(body, options = {}) {
		super(body);
		this.options = options;
		this.setOptionDefaults();
		this.textParserLines = [];

		this.relativePublicImageDirectory = '';
		this.sourceImageAbsolutePath = config.sourceImageAbsolutePath();
		this.targetImageAbsolutePath = '';
	}

	setOptionDefaults() {
		if (!this.options.hasOwnProperty('httpHighlightInCode')) {
			this.options.httpHighlightInCode = true;
		}
	}

	parse(options = {}) {
		const highlightedDateLines = _.has(options, 'highlightedDateLines') ? options.highlightedDateLines : false;
		const highlightedDateLinesStart = _.has(options, 'highlightedDateLinesStart') ? options.highlightedDateLinesStart : '';
		if (!qstr.isEmpty(highlightedDateLinesStart)) {
			this.lines.unshift(highlightedDateLinesStart);
		}
		this.setPublicImageDirectory(this.relativePublicImageDirectory);
		let lineNumber = 1;
		let lastNumberOfIndents = 0;
		let currentlyRecordingCodeBlock = false;
		const codeBlockDelimiter = '-----------';
		let currentCodeBlockLines = [];
		let currentCodeBlockNumberOfIndents = [];
		for (const line of this.lines) {
			const textParserLine = new TextParserLine(line, lineNumber, lastNumberOfIndents, this.lines.length, this.options);
			textParserLine.sourceImageAbsolutePath = this.sourceImageAbsolutePath;
			textParserLine.targetImageAbsolutePath = this.targetImageAbsolutePath;
			textParserLine.relativePublicImageDirectory = this.relativePublicImageDirectory;
			textParserLine.parse(options);

			if (currentlyRecordingCodeBlock) {
				if (textParserLine.content.startsWith(codeBlockDelimiter)) {
					// we are finished recording the code block, so close it up
					textParserLine.codeBlockLines = currentCodeBlockLines;
					textParserLine.codeBlockNumberOfIndents = currentCodeBlockNumberOfIndents;
				} else {
					//currentCodeBlockLines.push(textParserLine.content + '/' + textParserLine.numberOfIndents);
					const encodedCodeLine = qstr.encodeHtmlForDisplay(textParserLine.content);
					currentCodeBlockLines.push(encodedCodeLine);
					currentCodeBlockNumberOfIndents.push(textParserLine.numberOfIndents);
					continue;
				}
			}

			// check to see if we need to start recording a code block
			if (!currentlyRecordingCodeBlock && textParserLine.content.startsWith(codeBlockDelimiter)) {
				currentlyRecordingCodeBlock = true;
				continue;
			}

			//if we are saving a code block line, then redefine the content which is currently the delimiter line
			if (currentlyRecordingCodeBlock) {
				textParserLine.content = '(CODE BLOCK LINE)';
			}

			this.textParserLines.push(textParserLine);

			// if we are this far, then all block recording will be over, so force it over here
			currentlyRecordingCodeBlock = false;
			currentCodeBlockLines = [];
			currentCodeBlockNumberOfIndents = [];
			lastNumberOfIndents = textParserLine.numberOfIndents;

			lineNumber++;

		}

		this.postProcess()

	}

	// relativeDirectory = e.g. "customImages/howtos"
	// sets = e.g. ""
	setPublicImageDirectory(relativeDirectory) {
		this.targetImageAbsolutePath = config.getApplicationPath() + 'public\\' + qstr.replaceAll(relativeDirectory, '/', '\\') + '\\';
	}

	postProcess() {
		let i = 0;
		let holdTextParserLine = null;
		for (const textParserLine of this.textParserLines) {
			let lastPostHtml = '';
			if (i != 0) {
				lastPostHtml = holdTextParserLine.postHtml;
			}

			if (lastPostHtml == '</li>' && textParserLine.preHtml.startsWith('<ul')) {
				this.textParserLines[i - 1].postHtml = '';
			}
			if (textParserLine.preHtml.startsWith('</ul>')) {
				this.textParserLines[i].preHtml = qstr.chopLeft(this.textParserLines[i].preHtml, '</ul>');
				this.textParserLines[i].preHtml = '</ul></li><li>' + this.textParserLines[i].preHtml;
			}

			this.textParserLines[i].preHtml = this.textParserLines[i].preHtml.replace('<li><li>', '<li>'); //correction
			this.textParserLines[i].preHtml = this.textParserLines[i].preHtml.replace('<li></ul>', '</ul>'); //correction

			holdTextParserLine = textParserLine;
			i++;
		}
	}

	displayParsed() {
		let r = '';
		for (const textParserLine of this.textParserLines) {
			r += textParserLine.displayAsHtml();
		}
		r = qstr.replaceAll(r, '<li>\[DELETETHIS\]', '');
		r = qstr.replaceAll(r, 'CODEMARKER_OPEN_LI', '&lt;li>');
		r = qstr.replaceAll(r, 'CODEMARKER_CLOSE_LI', '&lt;/li>');
		r = qstr.replaceAll(r, 'CODEMARKER_CLOSE_UL', '&lt;/ul>');

		r = '<div class="outlineWrapper">' + r + '</div>';
		return r;
	}
}

module.exports = OutlineTextParser