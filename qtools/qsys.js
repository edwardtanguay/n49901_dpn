"use strict"
const qstr = require('../qtools/qstr');
const qsys = require('../qtools/qsys');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const config = require('../system/config');
const System = require('../system/system');
const DynamicFile = require('../systemClasses/dynamicFile');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const SmartItemType = require('../systemClasses/smartItemType');

exports.sleep = function (ms) {
	var start = new Date().getTime();
	let now = 0;
	let difference = 0;
	for (var i = 0; i < 1e17; i++) {
		now = new Date().getTime();
		difference = now - start;
		if (difference > ms) {
			break;
		}
	}
}

exports.protectSqlVariable = function (value) {
	//return value.replace('"', '\\"');
	return escape(value);
}

exports.setSessionVariable = function (request, idCode, value) {
	request.session[idCode] = value;
}

exports.getSessionVariable = function (request, idCode, defaultValue = '') {
	const value = request.session[idCode];
	if (qstr.isEmpty(value)) {
		return defaultValue;
	} else {
		return request.session[idCode];
	}
}

exports.buildAllowedPageItems = function (allPageItems, currentUser) {
	const pageItems = [];
	for (const pageItem of allPageItems) {
		if (qstr.atLeastOneTermMatchesInLists(pageItem.accessGroups, currentUser.accessGroups)) {
			pageItems.push(pageItem);
		}
	}
	return pageItems;
}


// when user is logged on, the site allows user to go to login page
// but does not list it in the menu
exports.buildMenuPageItems = function (menu, allowedPageItems, request) {
	const pageItems = [];
	for (const pageItem of allowedPageItems) {
		if (qsys.userIsCurrentlyLoggedIn(request) && pageItem.idCode == 'login') {
			// do not include login page in menu if user is logged in
		} else {
			if (pageItem.menu == menu) {
				pageItems.push(pageItem);
			}
		}
	}
	return pageItems;
}

exports.userHasAccessToPage = function (currentUser, currentPageItem) {
	return qstr.atLeastOneTermMatchesInLists(currentUser.accessGroups, currentPageItem.accessGroups);
}

exports.buildPathAndFileName = function (pageItemIdCode) {
	const pageFileName = pageItemIdCode + "." + config.pageFileExtension();
	let baseDirname = qstr.chopRight(__dirname, '\\qtools');
	baseDirname = qstr.chopRight(baseDirname, '/qtools');
	return baseDirname + config.systemSlash() + "systemPages" + config.systemSlash() + pageFileName;
}

exports.getPageItemFromCollection = function (pageItems, pageItemIdCode) {
	for (const pageItem of pageItems) {
		if (pageItem.idCode === pageItemIdCode) {
			return pageItem;
		}
	}
	return null;
}

exports.setCurrentUserIdCode = function (request, userIdCode) {
	qsys.setSessionVariable(request, 'currentUserIdCode', userIdCode);
}

exports.getCurrentUserIdCode = function (request = null) {
	if (request != null) {
		qdev.debug('got from here');
		console.log(request.session);
		return qsys.getSessionVariable(request, 'currentUserIdCode', config.defaultUserIdCode());
	} else {
		return config.getUserIdCodeWhenItIsNotUnknownWhoOwnsRecord();
	}
}

exports.userIsCurrentlyLoggedIn = function (request = null) {
	if (request == null) {
		return false;
	}

	if (config.developing()) {
		return true;
	}
	const currentUserIdCode = qsys.getCurrentUserIdCode(request);
	return currentUserIdCode != config.defaultUserIdCode();
}

exports.siteLocation = function () {
	if (config.developing()) {
		return 'offline';
	}
	return 'online'; //TODO: determine if online or offline, e.g. to disable certain developer features when online
}

exports.getLoremIpsumText = function (repeatTimes = 1) {
	const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar nibh mattis mauris vehicula, non pulvinar ante accumsan. Nulla facilisi. Nam eget dignissim ipsum, in lacinia lorem. Quisque tristique mi dolor, vel interdum diam pellentesque id. Donec pulvinar tellus non leo euismod egestas. Mauris eleifend pulvinar libero, a dapibus neque consequat in. Maecenas rutrum sed enim malesuada tincidunt. Maecenas pellentesque sapien ut odio efficitur imperdiet. Donec hendrerit cursus velit, quis egestas neque. Sed in tristique ipsum. Cras dui neque, pellentesque non pellentesque vel, fringilla vel risus. Sed sed elit venenatis, elementum lacus vel, aliquam leo. Etiam lectus quam, eleifend vel arcu at, scelerisque mattis dolor.';
	const lorems = [];
	for (let x = 1; x <= repeatTimes; x++) {
		lorems.push(lorem);
	}
	return lorems.join(qstr.NEW_LINE());
}

exports.getObjectRecordFromData = function (data, itemTypeIdCode) {
	const obj = data[itemTypeIdCode];
	return obj;
}

exports.getArrayOfObjectRecordsFromData = function (data, itemTypeIdCode) {
	const objectRecords = data[itemTypeIdCode];
	return objectRecords;
}

exports.isSqliteError = function (data) {
	//FIX: https://stackoverflow.com/questions/54550955/how-to-stop-get-contents-of-console-log-in-a-string-in-node-without-it-outputtin
	return false;
	// if (data.records == undefined || data.records.code == 'SQLITE_ERROR') {
	//     return true;
	// } else {
	//     return false;
	// }
}

exports.isSqliteErrorBasedOnRecords = function (records) {
	if (records.code == 'SQLITE_ERROR') {
		return true;
	} else {
		return false;
	}
}

exports.getUserIdCodeWhenItIsNotUnknownWhoOwnsRecord = function () {
	return 'systemUnknown';
}

//e.g. "00010" to "0.00.10"
exports.convertVersionIdCodeToNiceVersion = function (versionIdCode) {
	const base = versionIdCode.substring(0, 1); // 0
	const main = versionIdCode.substring(1, 3); // 00
	const detail = versionIdCode.substring(3, 5); // 10
	return `${base}.${main}.${detail}`;
}

exports.deletePage = function (pageIdCode) {
	let pageBuilder = null;
	pageBuilder = System.instantiatePageBuilder(pageIdCode, 'editItem', 'system', {});
	pageBuilder.delete();
}

exports.changeMarkerLine = function (pathAndFileName, marker, codeLine) {
	const dynamicPage = new DynamicFile(pathAndFileName);
	dynamicPage.changeMarkerLineAndSave(marker, codeLine);
}

exports.getLatestDpnVersionFromDatabase = function (callback) {
	const dpDataLoader = new DpDataLoader();
	const sql = `SELECT * FROM dpnVersions ORDER BY id DESC LIMIT 1`;
	dpDataLoader.getRecordWithSql('record', sql);
	dpDataLoader.load(function (data) {
		const record = data['record'];
		const dpnVersion = record['idCode'];
		const dpnVersionNice = qsys.convertVersionIdCodeToNiceVersion(dpnVersion);
		callback({
			dpnVersion: dpnVersion,
			dpnVersionNice: dpnVersionNice
		});
	});
}

exports.deleteItemType = function (itemTypeIdCode) {
	const smartItemType = new SmartItemType(`** ${itemTypeIdCode}`);
	smartItemType.delete();
}

exports.logLocalDevUserOut = function () {
	const dynamicPage = new DynamicFile('system/developer_config.js');
	dynamicPage.changeMarkerLineAndSave('defaultUserIdCode', "return 'anonymousUser';");
	dynamicPage.changeMarkerLineAndSave('configDeveloping', "return false;");
	qsys.sleep(3000); // wait for nodemon to restart
}

exports.getItemTypeIdCodesFromFiles = function () {
	const files = qfil.getFileNamesInDirectory('systemItems');

	const itemTypeIdCodes = [];
	for (const file of files) {
		if (qstr.endsWith(file, 's.js') && file != 'items.js') {
			const itemTypeIdCode = qstr.chopRight(file, '.js');
			itemTypeIdCodes.push(itemTypeIdCode);
		}
	}
	return itemTypeIdCodes;
}

exports.isValidItemTypeIdCode = function (itemTypeIdCode) {
	const itemTypeIdCodes = qsys.getItemTypeIdCodesFromFiles();
	return itemTypeIdCodes.includes(itemTypeIdCode);
}

exports.currentUserData = function (request, callback) {
	const data = {};
	const currentUserIdCode = qsys.getCurrentUserIdCode(request);
	const dpDataLoader = new DpDataLoader();
	dpDataLoader.getRecordWithSql('currentUser', `SELECT * FROM users WHERE login = '${currentUserIdCode}'`);
	const that = this;
	dpDataLoader.load(function (record) {
		const objectRecord = qsys.getObjectRecordFromData(record, 'currentUser');
		const data = {};
		// only pass needed information
		data.login = objectRecord.login;
		data.accessGroups = objectRecord.accessGroups;
		callback(data);
	});
}

exports.currentUserIsDeveloper = function (request, callback) {
	qsys.currentUserData(request, function (data) {
		const isDeveloper = qstr.atLeastOneTermMatchesInLists('developers', data.accessGroups);
		callback(isDeveloper);
	});
}


exports.isTechSite = function (callback) {
	const dpDataLoader = new DpDataLoader();
	dpDataLoader.getRecordWithSql(`pageItemRecord`, `select menu from pageItems where idCode = 'thirdPartyTools4'`);
	dpDataLoader.load(data => {
		const menuFieldValue = data.pageItemRecord.menu;
		callback(menuFieldValue == 'SWITCHED');
	});
}

//returns whether the code is online (on the linux hosting server) or offline (on a local windows computer)
exports.isOnline = function () {
	return config.operatingSystem() == 'linux';
}

// e.g. "/techItems?id=83&idCode=123"
exports.getUrlInfo = function (request) {
	const parts = qstr.breakIntoParts(request.originalUrl, '?');
	let pageIdCode = '';
	const params = {};
	if (parts.length >= 1) {
		pageIdCode = qstr.chopLeft(parts[0], '/');
	}
	if (parts.length == 2) {
		const paramsLine = parts[1];
		const pairs = qstr.breakIntoParts(paramsLine, '&');
		for (const pair of pairs) {
			const sides = qstr.breakIntoParts(pair, '=');
			const key = sides[0];
			const value = sides[1];
			if (!qstr.isEmpty(key)) {
				params[key] = value;
				// params.push({
				// 	key: key,
				// 	value: value
				// });
			}
		}
	}
	return {
		pageIdCode: pageIdCode,
		params: params
	};
}

