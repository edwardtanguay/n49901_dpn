"use strict"
const qstr = require('../qtools/qstr');
const TextFileBuilder = require('../systemBuilders/textFileBuilder');


class DpFileSystem {
	static createFileWithTemplate(pathAndFileName, templateIdCode, data = []) {
		const textFileBuilder = new TextFileBuilder(templateIdCode);
		textFileBuilder.data = data;
		textFileBuilder.buildNow(pathAndFileName);
	}
}


module.exports = DpFileSystem