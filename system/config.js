"use strict"
const qstr = require('../qtools/qstr');
const qdev = require('../qtools/qdev');
const config = require('../system/config');

// === manually-defined configs ===================

//** NOW WORKING ON ISSUE003

// outputs debugging information to console, keeps developer logged in even after backend modifications to code
exports.developing = function () {
	return false;//DYNAMIC_LINE:configDeveloping
}

// enables site to be switched between "parked" (for copying) and "live" (for using) 
exports.siteMode = function () {
	return 'live';//DYNAMIC_LINE:configSiteMode
}

// obfuscation for developing machine
// paste here output from the developer's browser Javascript output for: 
// config.log(navigator.userAgent);
exports.developingAllowedBrowserSignature = function () {
	const signature = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36';
	return signature;
}

exports.port = function () {
	return '49911';
}

// enables alternative codes to be given for items
// when they are imported, e.g. 'fc': 'flashcard' would map:
//
// ==fc
// house
// das Haus
//
// to:
//
// ==flashcard
// house
// das Haus
exports.importedItemMarkerRemappings = function () {
	return {
		'sb': 'showcaseBook'
	};
}

exports.frontendLibrarySource = function () {
	return 'online'; // "local" or "online"
}

exports.getFrontendLibraryPaths = function () {
	const data = {};
	if (config.frontendLibrarySource() == 'local') {
		const prePath = 'frontendLibraries/';
		data.jquery = prePath + 'jquery-2.2.4.min.js';
		data.bootstrapCss = prePath + 'bootstrap.min.css';
		data.bootstrapJs = prePath + 'bootstrap.min.js';
		data.popper = prePath + 'popper.min.js';
		data.fontAwesome = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'; // TODO: fix this so it can use -webfont/ttf files, etc.
		data.vuejs = prePath + 'vue.js';
		data.axios = prePath + 'axios.min.js';
		data.lodash = prePath + 'lodash.js';
		data.bootbox = prePath + 'bootbox.min.js';
	} else {
		data.jquery = 'https://code.jquery.com/jquery-2.2.4.min.js';
		data.bootstrapCss = 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css';
		data.bootstrapJs = 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js';
		data.popper = 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js';
		data.fontAwesome = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css';
		data.vuejs = 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.1.4/vue.js';
		data.axios = 'https://cdnjs.cloudflare.com/ajax/libs/axios/0.16.2/axios.min.js';
		data.lodash = 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.js';
		data.bootbox = 'https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.4.0/bootbox.min.js';
	}
	return data;
}

exports.layout = function () {
	return 'plain'; // plain, bootstrap
}

// this is the directory where the user can save 
// images which are automatically copied in e.g. 
// when referencing them with '##' in Outline text,
// see OutlineTextParser
exports.sourceImageAbsolutePath = function () {
	return 'C:\\WORK\\import\\';
}

// e.g. makes developer panel appear on bottom of page
// you can override this in the home.ejs page with the comment line "//developer: true"
exports.developer = function () {
	return false;
}

exports.availableExtensionIdCodes = function () {
	return ['jquery', 'bootstrap', 'fontawesome', 'vuejs', 'axios', 'lodash'];
}

exports.pageFileExtension = function () {
	return 'ejs';
}

exports.basePageIdCode = function () {
	return 'home';
}

exports.operatingSystem = function () {
	if (process.platform == 'win32') {
		return 'windows';
	} else {
		return 'linux';
	}
}

exports.databasePathAndFileName = function () {
	return 'data/main.sqlite';
}

// this is the text on the menu and serves as the home page link
exports.getApplicationShortTitle = function () {
	//return 'Web Tech';
	//return 'Projects';
	return 'Site';
}

exports.blankLineMarker = function () {
	return 'nn';
}

// === other configs ==========================


exports.dpnVersion = function () {
	return '00402';
}

exports.systemSlash = function () {
	if (exports.operatingSystem() == 'windows') {
		return "\\";
	} else {
		return "/";
	}
}

exports.getApplicationPath = function () {
	let dirName = __dirname;
	dirName = dirName.replace('/qtools', '');
	return qstr.chopRight(dirName, 'system');
}

exports.getApplicationDirectory = function () {
	return qstr.chopRight(config.getApplicationPath(), '/');
}

// e.g. partialPathAndFileName = 'systemPages/testfile.ejs'
exports.getFullApplicationPathAndFileName = function (partialPathAndFileName) {
	const applicationPath = config.getApplicationPath();
	const fixedPartialPathAndFileName = partialPathAndFileName.replace('/', config.systemSlash());
	return applicationPath + fixedPartialPathAndFileName;
}

exports.dynamicFileCodeChunkMarker = function () {
	return '//:';
}

exports.dynamicFileCodeAreaMarker = function () {
	return `//${config.dynamicFileCodeAreaWordMarker()}:`;
}

exports.dynamicFileCodeAreaPlaceHolder = function () {
	return `[[${config.dynamicFileCodeAreaWordMarker()}:`;
}

exports.dynamicFileCodeAreaWordMarker = function () {
	return 'DYNAMIC_CODE_AREA';
}

exports.defaultUserIdCode = function () {
	return 'dev';//DYNAMIC_LINE:defaultUserIdCode
}

exports.environment = function () {
	if (config.operatingSystem() == 'linux') {
		return 'public';
	} else {
		return 'local';
	}
}

exports.getUserIdCodeWhenItIsNotUnknownWhoOwnsRecord = function () {
	return 'systemUnknown';
}

//this is used in showcaseMultistepAjaxProcess to change a file so that node has to restart
const testVariable = '672438'; //DYNAMIC_LINE:testVariable
