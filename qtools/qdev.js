"use strict"
// qdev = "Quick Developer Functions": functions that help you develop and debug
const stackTrace = require("stack-trace/lib/stack-trace");
const path = require("path");
const qdat = require('../qtools/qdat');
const qstr = require('../qtools/qstr');

exports.debug = function (label, value) {
	//new   

	frame = stackTrace.get()[1];
	file = path.basename(frame.getFileName());
	line = frame.getLineNumber();
	if (this.itsAnObjectWithDebuggingInfos(label, value)) {

		const object = label;
		const infos = object.getDebuggingInfos();
		console.log(`>>> ${object.constructor.name}.getDebuggingInfos() <<< ` + file + ":" + line + " <<<< DEBUG <<<<<" + qdat.getCurrentDateTime());
		for (const variableName in infos) {
			const value = infos[variableName];
			console.log(`${variableName} = [${value}]`);
		}

	} else {

		var args, file, frame, line, method;
		args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];

		if (value === undefined) {
			console.log(">>> " + label.toUpperCase() + " <<< " + file + ":" + line + " <<<< DEBUG <<<<<" + qdat.getCurrentDateTime());
		} else {
			if (typeof value === 'object' && value !== null) {
				console.log(">>> " + label.toUpperCase() + " = [SEE OBJECT BELOW] <<< " + file + ":" + line + " <<<< DEBUG <<<<<" + qdat.getCurrentDateTime());
				console.log(value);
			} else {
				console.log(">>> " + label.toUpperCase() + " = [" + value + "] <<< " + file + ":" + line + " <<<< DEBUG <<<<<" + qdat.getCurrentDateTime());
			}
		}
	}
};

exports.itsAnObjectWithDebuggingInfos = function (label, value) {
	if (typeof label === 'object' && label !== null) {
		if (typeof label.getDebuggingInfos === 'function' && value == undefined) {
			return true;
		}
	}
	return false;
}

exports.showWhiteSpace = function (text) {
	let r = text;
	r = qstr.replaceAll(r, ' ', '•');
	r = qstr.replaceAll(r, '\t', '[TAB]');
	return r;
}