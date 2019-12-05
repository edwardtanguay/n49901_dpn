"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const qdat = require('../qtools/qdat');
const config = require('../system/config');
const system = require('../system/system');
const _ = require('lodash');

// TODO: CHANGE TO outlineTextParserLine
class TextParserLine {
	constructor(line, lineNumber, lastNumberOfIndents, totalNumberOfLines, options) {
		this.options = options;
		this.line = line;
		this.lineNumber = lineNumber;
		this.lastNumberOfIndents = lastNumberOfIndents;
		this.totalNumberOfLines = totalNumberOfLines;
		this.relativePublicImageDirectory = '';
		this.rawLine = line;
		this.numberOfIndents = qstr.getNumberOfPrecedingTabs(line, true);
		this.imageIdCode = '';
		this.imageFileName = '';
		this.sourceImageAbsolutePath = '';
		this.targetImageAbsolutePath = '';
		this.sourceImageAbsolutePathAndFileName = '';
		this.targetImageAbsolutePathAndFileName = '';
		this.imagePathAndFileName = '';
		this.content = qstr.chopLeft(line.trim(), '- ').trim();
		this.preHtml = '';
		this.html = '';
		this.postHtml = '';
		this.codeBlockLines = [];
		this.codeBlockNumberOfIndents = [];
		this.videoIdCode = '';

		this.parseImageIdCode();
		this.parseVideoIdCode();
	}

	parseImageIdCode() {
		const regex = /##([a-zA-Z0-9]*)$/;
		const matches = this.content.match(regex)
		this.content = this.content.replace(regex, '');
		if (matches != null) {
			this.imageIdCode = matches[1];
		}
	}

	parseVideoIdCode() {
		const regex = /@@([a-zA-Z0-9]*)$/;
		const matches = this.content.match(regex)
		this.content = this.content.replace(regex, '');
		if (matches != null) {
			this.videoIdCode = matches[1];
		}
	}




	parse(options = {}) {
		const highlightedDateLines = _.has(options, 'highlightedDateLines') ? options.highlightedDateLines : false;
		//process image file
		if (this.imageIdCode != '') {
			this.imageFileName = this.imageIdCode + '.png';
			this.sourceImageAbsolutePathAndFileName = this.sourceImageAbsolutePath + this.imageFileName;
			this.targetImageAbsolutePathAndFileName = this.targetImageAbsolutePath + this.imageFileName;
			qfil.forceCreateDirectory(this.targetImageAbsolutePath);
			if (qfil.fileExists(this.sourceImageAbsolutePathAndFileName) && !qfil.fileExists(this.targetImageAbsolutePathAndFileName)) {
				qfil.copyFileAbsolute(this.sourceImageAbsolutePathAndFileName, this.targetImageAbsolutePathAndFileName);
			}
			this.imagePathAndFileName = this.relativePublicImageDirectory + '/' + this.imageFileName;
		}

		const numberOfIndents = qstr.getNumberOfPrecedingTabs(this.line, true);
		if (this.lineNumber == 1) {
			this.preHtml += '<ul class="outline">';
		} else if (this.lastNumberOfIndents < numberOfIndents) {
			this.preHtml += '<ul class="outline">';
		} else if (this.lastNumberOfIndents > numberOfIndents) {
			for (let x = 1; x <= this.lastNumberOfIndents - numberOfIndents; x++) {
				this.preHtml += '</ul>';
			}
		}

		this.preHtml += '<li>';
		this.html += this.parseForOutline();

		//options
		if (highlightedDateLines) {
			if (qdat.isStandardDate(this.content)) {
				//this.html = `<b>${this.html}</b>`;
				//this.html = `<b>${qdat.getShortMonthWithWeekDay(this.content)}</b>`;
				this.html = `<span class="theDateLine">${qdat.getShortMonthWithWeekDay(this.content, { fullWeekDay: true })}</class>`;
			}
		}

		this.postHtml += '</li>';

		if (this.lineNumber == this.totalNumberOfLines) {
			this.postHtml += '</ul>';
		}
	}

	displayAsHtml() {
		let r = '';

		if (this.codeBlockLines.length > 0) {
			r += this.preHtml;
			r += '[DELETETHIS]';
			r += '<li class="codeBlock">'
			if (qstr.linesContainCode(this.codeBlockLines)) {
				r += '<div class="codeBlock"><pre>';
			} else {
				r += '<div class="paragraphBlock"><pre>';
			}
			let i = 0;
			for (const line of this.codeBlockLines) {
				const codeBlockNumberOfIndent = this.codeBlockNumberOfIndents[i];
				let actualCodeIndent = codeBlockNumberOfIndent - this.numberOfIndents;
				actualCodeIndent = actualCodeIndent < 0 ? 0 : actualCodeIndent;
				//r += `<div style="padding-left:${actualCodeIndent*20}px">${line}</div>`;
				const maskedLine = this.maskTheLine(line);
				r += `<div>${qstr.addPrecedingTabs(maskedLine, actualCodeIndent)}</div>`;
				i++;
			}
			r += '</pre></div>';
			//r += 'CODEBLOCK';
			//r += this.html;
		} else {
			r += this.preHtml;
			r += this.html;
		}
		r += this.getHtmlForImage();
		r += this.getHtmlForVideo();
		r += this.postHtml;

		return r;
	}

	maskTheLine(line) {
		line = qstr.replaceAll(line, '<li>', 'CODEMARKER_OPEN_LI');
		line = qstr.replaceAll(line, '</li>', 'CODEMARKER_CLOSE_LI');
		line = qstr.replaceAll(line, '</ul>', 'CODEMARKER_CLOSE_UL');
		return line;
	}

	getHtmlForImage() {
		if (this.imageIdCode != '') {
			return '<div><img class="outlineImage" src="' + this.imagePathAndFileName + '"/></div>';
		} else {
			return '';
		}
	}

	getHtmlForVideo() {
		if (this.videoIdCode != '') {
			return `<div><iframe class="video" src="https://www.youtube.com/embed/${this.videoIdCode}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
		} else {
			return '';
		}
	}

	parseButtonMarkers(text) {
		let r = text;
		r = qstr.replaceAllRegex(r, /\[\[(.*?)\]\]/i, (match, innerText, offset, string) => {
			return `<span class="standardOutlineButton">${innerText}</span>`;
		});
		return r;
	}

	parseForOutline() {
		let r = this.content;

		//if there is a markdown for a url, then don't parse for raw urls, i.e. either/or
		if (!qstr.containsUrlMarkdown(r)) {
			r = qstr.parseMarkDown(r, {
				suppressParagraphMarks: true, suppressOrderedListElements: true
			});
			if (this.options.httpHighlightInCode) {
				r = qstr.convertUrlsToLinkableUrls(r);
			}
		} else {
			r = qstr.parseMarkDown(r, {
				suppressParagraphMarks: true, suppressOrderedListElements: true
			});
		}

		r = this.parseButtonMarkers(r);

		//NOTE: a single ` caused this to hang
		// while (r.includes("`")) {
		//     //     //r = r.replace(/`(.*?)`/i, '<code>$1</code>');
		// }

		r = qstr.replaceAllRegex(r, /`(.*?)`/i, (match, innerText, offset, string) => {
			return `<code>${innerText}</code>`;
		});

		//r = 'AAA' + r + 'BBB';

		// call all other parsing in separate methods here
		r = this.parseTextToHighlight(r);

		return r;
	}

	// <H|This is highlighted text.|H>
	parseTextToHighlight(r) {
		r = qstr.replaceAll(r, `&lt;H|`, '<span class="outlineHighlight">');
		r = qstr.replaceAll(r, `|H&gt;`, '</span>');
		return r;
	}

}

module.exports = TextParserLine