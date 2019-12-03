const qstr = require('../qtools/qstr');
const qdev = require('../qtools/qdev');
const qsys = require('../qtools/qsys');
const system = require('../system/system');
const DataType = require('../systemDataTypes/dataType');

//DYNAMIC_CODE_AREA:dataTypeIncludeArea
const DataTypeId = require('../systemDataTypes/dataTypeId'); //:id
const DataTypeIdCode = require('../systemDataTypes/dataTypeIdCode'); //:idCode
const DataTypeLine = require('../systemDataTypes/dataTypeLine'); //:line
const DataTypeParagraph = require('../systemDataTypes/dataTypeParagraph'); //:paragraph
const DataTypeChoice = require('../systemDataTypes/dataTypeChoice'); //:choice
const DataTypeWholeNumber = require('../systemDataTypes/dataTypeWholeNumber'); //:wholeNumber
const DataTypeNumberOfBookPages = require('../systemDataTypes/dataTypeNumberOfBookPages'); //:numberOfBookPages
const DataTypeDateTime = require('../systemDataTypes/dataTypeDateTime'); //:dateTime
const DataTypeSystemWhenCreated = require('../systemDataTypes/dataTypeSystemWhenCreated'); //:systemWhenCreated
const DataTypeSystemWhoCreated = require('../systemDataTypes/dataTypeSystemWhoCreated'); //:systemWhoCreated
const DataTypeList = require('../systemDataTypes/dataTypeList'); //:list
const DataTypePassword = require('../systemDataTypes/dataTypePassword'); //:password
const DataTypeText = require('../systemDataTypes/dataTypeText'); //:text
const DataTypeMarkdown = require('../systemDataTypes/dataTypeMarkdown'); //:markdown
const DataTypeOutline = require('../systemDataTypes/dataTypeOutline'); //:outline
const DataTypeDepartment = require('../systemDataTypes/dataTypeDepartment'); //:department
const DataTypeLongLine = require('../systemDataTypes/dataTypeLongLine'); //:longLine

const DpRequestGetRecord = require('../systemClasses/dpRequestGetRecord');
const DpRequestGetRecords = require('../systemClasses/dpRequestGetRecords');
const DpRequestGetSearch = require('../systemClasses/dpRequestGetSearch');
const DpRequestExecuteSql = require('../systemClasses/dpRequestExecuteSql');
const PageBuilderEditItem = require('../systemBuilders/pageBuilderEditItem');
const PageBuilderTextParser = require('../systemBuilders/pageBuilderTextParser');
const PageBuilderCustomForm = require('../systemBuilders/pageBuilderCustomForm');
const PageBuilderDisplayXmlFile = require('../systemBuilders/pageBuilderDisplayXmlFile');
const PageBuilderSqlStatement = require('../systemBuilders/pageBuilderSqlStatement');
const PageBuilderItemTypeManager = require('../systemBuilders/pageBuilderItemTypeManager');
const PageBuilderTransformationSynchronizer = require('../systemBuilders/pageBuilderTransformationSynchronizer');
const PageBuilderManageItems = require('../systemBuilders/pageBuilderManageItems');
const PageBuilderManageItem = require('../systemBuilders/pageBuilderManageItem');
const PageBuilderMultipleAjaxSteps = require('../systemBuilders/pageBuilderMultipleAjaxSteps');
const PageBuilderItemTypeDisplay = require('../systemBuilders/pageBuilderItemTypeDisplay');
const PageBuilderSimpleData = require('../systemBuilders/pageBuilderSimpleData');
const PageBuilderMultiitemSearchPage = require('../systemBuilders/pageBuilderMultiitemSearchPage');
const PageBuilderScreenScraping = require('../systemBuilders/pageBuilderScreenScraping');

//DYNAMIC_CODE_AREA:includeItemArea
const ItemType = require('../systemItems/itemType'); //:itemTypes
const PageItem = require('../systemItems/pageItem'); //:pageItems
const ShowcaseBook = require('../systemItems/showcaseBook'); //:showcaseBooks
const ShowcaseUser = require('../systemItems/showcaseUser'); //:showcaseUsers
const User = require('../systemItems/user'); //:users
const TestServer = require('../systemItems/testServer'); //:testServers

//DYNAMIC_CODE_AREA:includeItemsArea
const ItemTypes = require('../systemItems/itemTypes'); //:itemTypes
const PageItems = require('../systemItems/pageItems'); //:pageItems
const ShowcaseBooks = require('../systemItems/showcaseBooks'); //:showcaseBooks
const ShowcaseUsers = require('../systemItems/showcaseUsers'); //:showcaseUsers
const Users = require('../systemItems/users'); //:users
const TestServers = require('../systemItems/testServers'); //:testServers

// dataTypeDefinitionLine = e.g.
// id >>> WholeNumber
// idcode 
// First Name
// When Created;dt
// Comments;p
// Number Times Logged In;pwn
// Operating System;choiceList;$choices=linux|*windows|mac(MAC);$choiceFormat=radioButtonsHorizontal
// Comments;p;$label=User Comments;$maximumLength=255;$description=Describe your experience here.
// Last Name;line;$idCode=lname

// types: 
// id [id] (naturalNumber, unique)
// idCode [idCode] (camelCase string, unique)
// Line (string)
// WholeNumber (0, 1, 2, 3, etc.) wn
// NaturalNumber (1, 2, 3, etc.) nn
// Integer (-999, -2, 0, 1, 2, 3, etc.) int
// Date (2018-08-10)
// DateTime (2018-08-10 12:23:12)
// Duration (2.001, 10, 10s, 24:55, 24m55s, 04:02:04, 4h2m3s, 2m3s999ms 1day, 2weeks, 1month, 3years) -- saves in milliseconds (31,536,000,000,000 in 1000 years)
// Paragraph [p] (with newlines)
// ChoiceList >>> List
// List [list] (a list of any strings)
// Decimal [dec] (1.342343)
// Rank [rank] (0, 0.5, 1, 1.5 ... 4, 4.5, 5)
// IpAddress [ip] (192.168.0.123)
// Email [email]
// Url
// HtmlColor
// Distance (dist) 1m, 1000m, 5k, 5km

// this would be in the DataType class, but it causes a circular require error, therefore it is here
exports.instantiateDataType = function (dataTypeDefinitionLine) {

	const originalDataTypeDefinitionLine = dataTypeDefinitionLine;

	//allow line to be assumed even when there are extra variables
	dataTypeDefinitionLine = system.forceLineDataTypeIfExtrasArePresent(dataTypeDefinitionLine);

	const parts = qstr.breakIntoParts(dataTypeDefinitionLine, ';', 3);
	let label = parts[0];
	let dataTypeIdCode = parts.length > 1 ? parts[1] : '';
	let extras = parts.length > 2 ? parts[2] : '';

	//allow "*" at beginning of line to determine that it is required
	//TODO: refactor with SmartExtras 
	if (label.startsWith('*')) {
		label = qstr.chopLeft(label, '*').trim();
		if (qstr.isEmpty(extras)) {
			extras = '$required';
		} else {
			extras += ';$required';
		}
	}

	//shorthand, todo: store in database, and search through all e.g. shorthandIdentifier
	switch (dataTypeDefinitionLine) {
		case 'id':
			label = 'ID';
			dataTypeIdCode = 'id';
			extras = '$kind=system';
			break;
		case 'idcode':
			label = 'ID-Code';
			dataTypeIdCode = 'idCode';
			break;
	}

	switch (dataTypeIdCode) {
		case 'p':
			dataTypeIdCode = 'paragraph';
			break;
		case 'wn':
			dataTypeIdCode = 'wholeNumber';
			break;
		case 'nbp':
			dataTypeIdCode = 'numberOfBookPages';
			break;
		case 'dt':
			dataTypeIdCode = 'dateTime';
			break;
	}

	let dataType = null;
	switch (dataTypeIdCode) {
		//DYNAMIC_CODE_AREA:dataTypeSwitchBlock,3
		case 'id': //:id
			dataType = new DataTypeId(label, extras);
			break;
		case 'idCode': //:idCode
			dataType = new DataTypeIdCode(label, extras);
			break;
		case 'paragraph': //:paragraph
			dataType = new DataTypeParagraph(label, extras);
			break;
		case 'choice': //:choice
			dataType = new DataTypeChoice(label, extras);
			break;
		case 'wholeNumber': //:wholeNumber
			dataType = new DataTypeWholeNumber(label, extras);
			break;
		case 'numberOfBookPages': //:numberOfBookPages
			dataType = new DataTypeNumberOfBookPages(label, extras);
			break;
		case 'dateTime': //:dateTime
			dataType = new DataTypeDateTime(label, extras);
			break;
		case 'systemWhenCreated': //:systemWhenCreated
			dataType = new DataTypeSystemWhenCreated(label, extras);
			break;
		case 'systemWhoCreated': //:systemWhoCreated
			dataType = new DataTypeSystemWhoCreated(label, extras);
			break;
		case 'list': //:list
			dataType = new DataTypeList(label, extras);
			break;
		case 'password': //:password
			dataType = new DataTypePassword(label, extras);
			break;
		case 'text': //:text
			dataType = new DataTypeText(label, extras);
			break;
		case 'markdown': //:markdown
			dataType = new DataTypeMarkdown(label, extras);
			break;
		case 'outline': //:outline
			dataType = new DataTypeOutline(label, extras);
			break;
		case 'department': //:department
			dataType = new DataTypeDepartment(label, extras);
			break;
		case 'test333': //:test333
			dataType = new DataTypeTest333(label, extras);
			break;
		case 'test444': //:test444
			dataType = new DataTypeTest444(label, extras);
			break;
		case 'longLine': //:longLine
			dataType = new DataTypeLongLine(label, extras);
			break;
		default:
			dataType = new DataTypeLine(label, extras);
			break;
	}
	dataType.dataTypeDefinitionLine = originalDataTypeDefinitionLine;
	return dataType;
}

// if "First Name; $info = No nicknames." then "First Name; line; $info = No nicknames."
exports.forceLineDataTypeIfExtrasArePresent = function (dataTypeDefinitionLine) {
	const parts = qstr.breakIntoParts(dataTypeDefinitionLine, '$');
	if (parts.length > 1) {
		const numberOfSemicolons = qstr.getNumberOfOccurancesInString(parts[0], ';');
		if (numberOfSemicolons == 1) {
			const pieces = qstr.breakIntoParts(dataTypeDefinitionLine, ';');
			const label = pieces[0];
			pieces.shift();
			pieces.unshift(label + ';line');
			newDataTypeDefinitionLine = pieces.join(';');
			return newDataTypeDefinitionLine;
		} else {
			return dataTypeDefinitionLine;
		}
	} else {
		return dataTypeDefinitionLine;
	}

}

exports.instantiateDataType_withField = function (field) {
	const dataTypeDefinitionLine = field.label + ';' + field.dataTypeIdCode;
	const dataType = system.instantiateDataType(dataTypeDefinitionLine);
	dataType.field = field;
	dataType.initializeWithField(field);
	return dataType;
}

exports.instantiateDataType_forValidation = function (dataTypeIdCode, value) {
	const dataTypeDefinitionLine = 'DummyLabel;' + dataTypeIdCode;
	const dataType = system.instantiateDataType(dataTypeDefinitionLine);
	dataType.value = value;
	return dataType;
}

exports.instantiateDpRequestGetRecord = function (idCode, sql, params) {
	return new DpRequestGetRecord(idCode, sql, params);
}

exports.instantiateDpRequestGetRecords = function (idCode, sql, params) {
	return new DpRequestGetRecords(idCode, sql, params);
}

exports.instantiateDpRequestGetSearch = function (idCode, tableName, searchText, columns) {
	return new DpRequestGetSearch(idCode, tableName, searchText, columns);
}

exports.instantiateDpRequestExecuteSql = function (idCode, sql, params) {
	return new DpRequestExecuteSql(idCode, sql, params);
}

exports.instantiatePageBuilder = function (title, type, kind, data) {
	switch (type) {
		case 'editItem':
			return new PageBuilderEditItem(title, type, kind, data);
		case 'textParser':
			return new PageBuilderTextParser(title, type, kind, data);
		case 'customForm':
			return new PageBuilderCustomForm(title, type, kind, data);
		case 'displayXmlFile':
			return new PageBuilderDisplayXmlFile(title, type, kind, data);
		case 'sqlStatement':
			return new PageBuilderSqlStatement(title, type, kind, data);
		case 'itemTypeManager':
			return new PageBuilderItemTypeManager(title, type, kind, data);
		case 'transformationSynchronizer':
			return new PageBuilderTransformationSynchronizer(title, type, kind, data);
		case 'manageItems':
			return new PageBuilderManageItems(title, type, kind, data);
		case 'manageItem':
			return new PageBuilderManageItem(title, type, kind, data);
		case 'multipleAjaxSteps':
			return new PageBuilderMultipleAjaxSteps(title, type, kind, data);
		case 'itemTypeDisplay':
			return new PageBuilderItemTypeDisplay(title, type, kind, data);
		case 'simpleData':
			return new PageBuilderSimpleData(title, type, kind, data);
		case 'multiitemSearchPage':
			return new PageBuilderMultiitemSearchPage(title, type, kind, data);
		case 'screenScraping':
			return new PageBuilderScreenScraping(title, type, kind, data);
		default:
			qdev.debug('ERROR: bad page type', type);
	}
}

exports.instantiateItem = function (itemTypeIdCode) {
	const factory = {
		//DYNAMIC_CODE_AREA:instantiateItemArea
		"itemTypes": ItemType, //:itemTypesg
		"pageItems": PageItem, //:pageItems
		"showcaseBooks": ShowcaseBook, //:showcaseBooks
		"showcaseUsers": ShowcaseUser, //:showcaseUsers
		"testServers": TestServer, //:testServers

		"users": User
	};
	if (qstr.objectHasKey(factory, itemTypeIdCode)) {
		return new factory[itemTypeIdCode]();
	} else {
		return null;
	}
}

exports.instantiateItems = function (itemTypeIdCode) {
	const factory = {
		//DYNAMIC_CODE_AREA:instantiateItemsArea
		"itemTypes": ItemTypes, //:itemTypes
		"pageItems": PageItems, //:pageItems
		"showcaseBooks": ShowcaseBooks, //:showcaseBooks
		"showcaseUsers": ShowcaseUsers, //:showcaseUsers
		"testServers": TestServers, //:testServers

		"users": Users
	};
	if (qstr.objectHasKey(factory, itemTypeIdCode)) {
		return new factory[itemTypeIdCode]();
	} else {
		return null;
	}
}

exports.instantiateItemsWithRecords = function (itemTypeIdCode, records) {
	const items = this.instantiateItems(itemTypeIdCode);
	items.fillWithRecords(records);
	return items;
}

exports.instantiateItemObjectsWithRecords = function (itemTypeIdCode, records) {
	return this.instantiateItemsWithRecords(itemTypeIdCode, records).asArray();
}

exports.instantiateItemWithRecord = function (itemTypeIdCode, record) {
	const item = this.instantiateItem(itemTypeIdCode);
	item.fillWithRecord(record);
	return item;
}
