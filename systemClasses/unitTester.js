"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdat = require('../qtools/qdat');
const qdbs = require('../qtools/qdbs');
//const dpod = require('../systemClasses/dpod');
const DqlDataLoader = require('./dqlDataLoader');
const LoadDqlStatementParser = require('./loadDqlStatementParser');
const PageItems = require('../systemItems/pageItems');
const PageItem = require('../systemItems/pageItem');
const DynamicFile = require('../systemClasses/dynamicFile');
const DynamicPageFile = require('../systemClasses/dynamicPageFile');
const _ = require('lodash');
const config = require('../system/config');
const system = require('../system/system');
const ShowcaseBook = require('../systemItems/showcaseBook');


class UnitTester {
	constructor() {
		this.numberSucceeded = 0;
		this.numberFailed = 0;
		this.verbose = false;
	}


	internal_runTests() {


		// MANUAL SECTION
		// comment and uncomment in order to test
		// -----------------------------------------------------
		//qfil.createFileWithStringBlock('unitTestData/testFile.txt', 'this is the content');
		//qfil.deleteFile('unitTestData/testFile.txt');
		//-----
		//const lines = ['111','222','333','444'];
		//qfil.createFileWithLines('unitTestData/testFile.txt', lines);
		//-----
		//const dynamicPage111 = new DynamicFile('unitTestData/unitTest_config.js');
		//dynamicPage111.changeMarkerLineAndSave('port', "return '11111';");
		//-----
		// const dynamicFileWithCodeAreas = new DynamicFile('unitTestData/testDynamicCode.js');
		// dynamicFileWithCodeAreas.debugOutput();
		// dynamicFileWithCodeAreas.addCodeChunkToCodeArea('loadTools', 'qdat', "const qdat = require('../qtools/qdat');");
		// dynamicFileWithCodeAreas.deleteCodeChunkFromCodeArea('loadTools', 'qstr');
		// dynamicFileWithCodeAreas.debugOutput();
		// dynamicFileWithCodeAreas.save();
		// ----------------------------------------------------- 

		//

		this.assertEquals("qstr.nnnnnnnn", qstr.convertBeginningSpacesToTabs('    pageItems'), '\tpageItems');
		this.assertEquals("qstr.nnnnnnnn", qstr.convertBeginningSpacesToTabs('      pageItems'), '\t  pageItems');




		const pageItems = system.instantiateItems('pageItems');
		this.assertEquals("items.getFieldBlock", pageItems.getFieldBlock().substring(1, 5), 'dCod');

		this.assertEquals("qstr.forcePlural", qstr.forcePlural('pageItem'), 'pageItems');


		this.assertEquals("qstr.forcePlural", qstr.forcePlural('pageItem'), 'pageItems');
		this.assertEquals("qstr.forcePlural", qstr.forcePlural('pageItems'), 'pageItems');


		this.assertEquals("qstr.objectHasKey", qstr.objectHasKey({
			firstName: 'Jim',
			lastName: 'Thompson',
			age: 34
		}, 'wontFindIt'), false);
		this.assertEquals("qstr.objectHasKey", qstr.objectHasKey({
			firstName: 'Jim',
			lastName: 'Thompson',
			age: 34
		}, 'firstName'), true);
		this.assertEquals("qfil.getRelativePathFromRelativePathAndFileName", qfil.getRelativePathFromRelativePathAndFileName('systemPages/another/createPage.ejs'), 'systemPages/another/');

		this.assertEquals("qfil.getDirectoryAndFileNameFromRelativePathAndFileName", qfil.getDirectoryAndFileNameFromRelativePathAndFileName('../n49901_dpnversion/systemPages/createPage.ejs'), '../n49901_dpnversion/systemPages,createPage.ejs');
		this.assertEquals("qfil.getDirectoryAndFileNameFromRelativePathAndFileName2", qfil.getDirectoryAndFileNameFromRelativePathAndFileName('testing.txt'), ',testing.txt');


		this.assertEquals("qstr.forceSingular", qstr.forceSingular('yearlyReports'), 'yearlyReport');

		//item types

		this.assertEquals("dataTypeInstantiation1", system.instantiateDataType('First Name').idCode, 'firstName');
		this.assertEquals("dataTypeInstantiation2", system.instantiateDataType('First Name').dataTypeIdCode, 'line');
		this.assertEquals("dataTypeInstantiation3", system.instantiateDataType('First Name; line; $info = No nicknames.').dataTypeIdCode, 'line');
		this.assertEquals("dataTypeInstantiation4", system.instantiateDataType('Age; wn; $info = Please enter the current age.').dataTypeIdCode, 'wholeNumber');
		this.assertEquals("dataTypeInstantiation5", system.instantiateDataType('First Name; line; $info = No nicknames.').info, 'No nicknames.');
		this.assertEquals("dataTypeInstantiation6", system.instantiateDataType('First Name; $info = No nicknames.').dataTypeIdCode, 'line');
		this.assertEquals("dataTypeInstantiation7", system.instantiateDataType('First Name; $info = No nicknames.').info, 'No nicknames.');
		this.assertEquals("dataTypeInstantiation8", system.instantiateDataType('Item Type Definition Block;p;$info=Title ~= e.g. Comments, Computers, File Change Items').info, 'Title = e.g. Comments, Computers, File Change Items');
		this.assertEquals("dataTypeInstantiation9", system.instantiateDataType('Data Type Definition Line;line;$info=iii;$example=eee').info + '/' + system.instantiateDataType('Data Type Definition Line;line;$info=iii;$example=eee').example, 'iii/eee');
		this.assertEquals("dataTypeInstantiation10", system.instantiateDataType('Data Type Definition Line;$info=iii;$example=eee').info + '/' + system.instantiateDataType('Data Type Definition Line;$info=iii;$example=eee').example, 'iii/eee');
		this.assertEquals("dataTypeInstantiation11", system.instantiateDataType('Title;$defaultValue=Test Bbbb Items;$example=Test Showcase Users;$info=Make sure you type the plural notation of the ItemType.').defaultValue, 'Test Bbbb Items');



		this.assertEquals("getNumberOfOccurancesInString1", qstr.getNumberOfOccurancesInString('this; that; and this', ';'), 2);
		this.assertEquals("getNumberOfOccurancesInString2", qstr.getNumberOfOccurancesInString('this; that; and this; ok', ';'), 3);
		this.assertEquals("getNumberOfOccurancesInString3", qstr.getNumberOfOccurancesInString('this; that; and this; ok', 'whatever'), 0);

		this.assertEquals("protectStringForHtmlInjection1", qstr.protectStringForHtmlInjection('test'), 'test');
		this.assertEquals("protectStringForHtmlInjection2", qstr.protectStringForHtmlInjection('test <script>alert("nnn");</script> ok'), 'test <span style="color:red">(SCRIPT BLOCKED)</span> ok');

		//parseExtras
		this.assertEquals("parseExtras1", qstr.parseExtras(`$choices=Yes, please send it to me.|No, please don't send it to me.|I'll decide later; $required; $info=Remember, you can unsubscribe at any time.; $default=no`).default, 'no');
		this.assertEquals("parseExtras2", qstr.parseExtras(`$keep; $isImportant=false`).isImportant, 'false');

		//parseDataTypeExtras
		this.assertEquals("parseDataTypeExtras1", qstr.parseDataTypeExtras(`$choices=Yes, please send it to me.|No, please don't send it to me.|I'll decide later; $required; $info=Remember, you can unsubscribe at any time.; $default=no`).required, true);
		this.assertEquals("parseDataTypeExtras2", qstr.parseDataTypeExtras(`$choices=Yes, please send it to me.|No, please don't send it to me.|I'll decide later; $required=false; $info=Remember, you can unsubscribe at any time.; $default=no`).required, false);
		this.assertEquals("parseDataTypeExtras3", qstr.parseDataTypeExtras(`$choices=Red|Blue|Green;$whatever=okok`).whatever, 'okok');
		this.assertEquals("parseDataTypeExtras4", qstr.parseDataTypeExtras(`$choices=Red|Blue|Green;$whatever=okok`).choicesList, 'Red|Blue|Green');
		this.assertEquals("parseDataTypeExtras5", qstr.parseDataTypeExtras(`$choices = Red, Blue, Green`).choicesList, 'Red| Blue| Green');
		this.assertEquals("parseDataTypeExtras6", qstr.parseDataTypeExtras(`$info=Choose the dominant color.;$choices = Red, Blue, Green`).info, 'Choose the dominant color.');
		this.assertEquals("parseDataTypeExtras7", qstr.parseDataTypeExtras(`$choices=Yes, please send it to me.|No, please don't send it to me.|I'll decide later; $required=true; $info=Remember, you can unsubscribe at any time.; $default=no`).required, true);
		this.assertEquals("parseDataTypeExtras7", qstr.parseDataTypeExtras(`$info = Title ~= e.g. Comments, Computers, File Change Items`).info, "Title = e.g. Comments, Computers, File Change Items");

		this.assertEquals("breakIntoParts", qstr.breakIntoParts('111,222,333')[1], '222');
		this.assertEquals("breakIntoParts", qstr.breakIntoParts('').length, 0);


		this.assertEquals("convertChoicesListToChoices1", qstr.convertChoicesListToChoices("Paperback|Hardcover*|E-Book[ebook]!")[0].label, 'Paperback') |
			this.assertEquals("convertChoicesListToChoices2", qstr.convertChoicesListToChoices("Paperback|Hardcover*|E-Book[ebook]!")[1].idCode, 'hardcover') |
			this.assertEquals("convertChoicesListToChoices3", qstr.convertChoicesListToChoices("Paperback|Hardcover*|E-Book[ebook]!")[2].label, 'E-Book') |
			this.assertEquals("convertChoicesListToChoices4", qstr.convertChoicesListToChoices("Paperback|Hardcover*|E-Book[ebook]!")[2].idCode, 'ebook') |
			this.assertEquals("convertChoicesListToChoices5", qstr.convertChoicesListToChoices("Paperback|Hardcover*|E-Book[ebook]!")[1].default, true) |
			this.assertEquals("convertChoicesListToChoices6", qstr.convertChoicesListToChoices("Paperback|Hardcover*|E-Book[ebook]!")[2].default, false) |
			this.assertEquals("convertChoicesListToChoices7", qstr.convertChoicesListToChoices("Paperback|Hardcover*|E-Book[ebook]!")[2].disabled, true) |
			this.assertEquals("convertChoicesListToChoices8", qstr.convertChoicesListToChoices("Paperback|Hardcover*|E-Book[ebook]!")[1].disabled, false) |

			this.assertEquals("smartPart1", qstr.getSmartPart(['zero', 'one', 'two', 'three'], 1), 'one');
		this.assertEquals("smartPart1", qstr.getSmartPart(['zero', 'one', 'two', 'three'], 2), 'two');
		this.assertEquals("smartPart1", qstr.getSmartPart(['zero', 'one', 'two', 'three'], 3), 'three');
		this.assertEquals("smartPart1", qstr.getSmartPart(['zero', 'one', 'two', 'three'], 4), '');
		this.assertEquals("smartPart1", qstr.getSmartPart(['zero', 'one', 'two', 'three'], 455), '');

		this.assertEquals("formatDateAsGermanDate", qdat.formatDateAsGermanDate("2018-12-31"), '31.12.2018');


		this.assertEquals("addLinesToLines", qstr.addLinesToLines(['111', '222'], ['333', '444']), '111,222,333,444');

		this.assertEquals("isString", qstr.isString("nnn"), true);
		this.assertEquals("isStringNumber", qstr.isString(234), false);
		this.assertEquals("isStringArray", qstr.isString(['111', '222']), false);

		this.assertEquals("isArray", qstr.isArray(['111', '222']), true);
		this.assertEquals("isArrayNumber", qstr.isArray(234), false);
		this.assertEquals("isArrayString", qstr.isArray("nnn"), false);

		this.assertEquals("tabs", qstr.tabs(2), "        ");
		this.assertEquals("tabs", qstr.tabs(0), "");

		this.assertEquals("removeEndMarkerAndGetNumberOfPrecedingTabsAndLine", qstr.removeEndMarkerAndGetNumberOfPrecedingTabsAndLine('        const temp = 2; //:temp', '//:'), "2,const temp = 2;");

		this.assertEquals("getRestAfterMarker", qstr.getRestAfterMarker("    //DYNAMIC_CODE_AREA:loadTools", '//DYNAMIC_CODE_AREA:'), "loadTools");

		this.assertEquals("addPrecedingTabs0", qstr.addPrecedingTabs("test", 0), "test");
		this.assertEquals("addPrecedingTabs1", qstr.addPrecedingTabs("test", 1), "    test");
		this.assertEquals("addPrecedingTabs2", qstr.addPrecedingTabs("test", 2), "        test");
		this.assertEquals("addPrecedingTabs3", qstr.addPrecedingTabs("    test", 1), "        test");

		this.assertEquals("getNumberOfPrecedingTabs", qstr.getNumberOfPrecedingTabs("        test with 2 proceeding tabs"), 2);
		this.assertEquals("getNumberOfPrecedingTabs2", qstr.getNumberOfPrecedingTabs("    test with 2 proceeding tabs"), 1);
		this.assertEquals("getNumberOfPrecedingTabs3", qstr.getNumberOfPrecedingTabs("test with 2 proceeding tabs"), 0);

		const dynamicMarkerPage = new DynamicFile('unitTestData/unitTest_config.js');
		this.assertEquals("dynamicMarkerPageCheckLine", dynamicMarkerPage.getLine(4), '//checkLineTest');
		this.assertEquals("dynamicMarkerPageCheckTabbedLine", dynamicMarkerPage.getLine(12), qstr.TAB() + '//checkLineWithTab');
		this.assertEquals("dynamicMarkerPageCheckValue", dynamicMarkerPage.getLine(8), qstr.TAB() + "return '11111';//DYNAMIC_LINE:port");

		this.assertEquals("qstrReplaceAll", qstr.replaceAll('abcabcabc', 'c', 'x'), 'abxabxabx');
		this.assertEquals("qstrReplaceAll", qstr.replaceAll('@@var = 23; display(@@var)', '@@var', 'test'), 'test = 23; display(test)');

		this.assertEquals("qstrGetSafePartPositive", qstr.getSafePart(['111', '222', '333'], 1), '222');
		this.assertEquals("qstrGetSafePartNegative", qstr.getSafePart(['111', '222', '333'], 3), '');
		this.assertEquals("qstrGetSafePartNegative2", qstr.getSafePart(['111', '222', '333'], 22), '');
		this.assertEquals("qdbsExtractTableNameFromSqlStatement", qdbs.extractTableNameFromInsertIntoSqlStatement("INSERT INTO showcaseUsers (login) VALUES ('tempUser')"), 'showcaseUsers');
		this.assertEquals("qdbsExtractTableNameFromSqlStatementNegative", qdbs.extractTableNameFromInsertIntoSqlStatement("CREATE TABLE..."), '');

		this.assertEquals("qstrProjectSqlValueNoParse", qstr.projectSqlValue('showcaseUsers'), 'showcaseUsers');
		this.assertEquals("qstrProjectSqlValueNumbersOk", qstr.projectSqlValue('showcase123Users'), 'showcase123Users');
		this.assertEquals("qstrProjectSqlValueFiltered", qstr.projectSqlValue('showcaseUsers"; DROP TABLE showcaseUsers'), 'showcaseUsersDROPTABLEshowcaseUsers');


		this.assertEquals("qstrIsIntegerNumberPositive", qstr.isInteger(34), true);
		this.assertEquals("qstrIsIntegerStringPositive", qstr.isInteger('34'), true);


		this.assertEquals("qstrContainsFail", qstr.contains('This is a test.', 'will not find it'), false);
		this.assertEquals("qstrContainsSucceed", qstr.contains('This is a test.', 'test'), true);
		this.assertEquals("qstrContainsNumberSucceed", qstr.contains(182732323, '73'), true);

		this.assertEquals("qstrIsIntegerNegative", qstr.isInteger('nnn'), false);
		this.assertEquals("qstrIsIntegerEmpty", qstr.isInteger(''), false);
		this.assertEquals("qstrIsIntegerMixed", qstr.isInteger('2834nnn'), false);

		this.assertEquals("atLeastOneTermMatchesInLists1", qstr.atLeastOneTermMatchesInLists('111,222,333,444', '333,aaa,bbb'), true);
		// this.assertEquals("atLeastOneTermMatchesInLists2", qstr.atLeastOneTermMatchesInLists('111,222,333,444', '333,444,bbb'), true);
		// this.assertEquals("atLeastOneTermMatchesInLists3", qstr.atLeastOneTermMatchesInLists('111,222,333,444', 'aaa,bbb,ccc'), true);

		//this.assertEquals("configGetApplicationPath", config.getApplicationPath(), 'c:\\edward\\dpn12\\');

		let dynamicPageFile;

		dynamicPageFile = DynamicPageFile.instantiateWithPageItemIdCode('home');
		this.assertEquals("dynamicPageFileStaticLoad", dynamicPageFile.pathAndFileName.includes('systemPages'), true);

		dynamicPageFile = new DynamicPageFile('systemPages/showcaseBaseTechnologies.ejs');
		this.assertEquals("dynamicPageFileGetExtensionLines", dynamicPageFile.getDataFromVariableLine('extensions'), 'jquery,bootstrap,vuejs,axios,lodash,fontawesome');
		this.assertEquals("dynamicPageFileGetExtensionIdCodes", dynamicPageFile.getExtensionIdCodes(), 'jquery,bootstrap,vuejs,axios,lodash,fontawesome');
		this.assertEquals("dynamicPageFileGetIdCodeArrayFromVariableLine", dynamicPageFile.getIdCodeArrayFromVariableLine('extensions'), 'jquery,bootstrap,vuejs,axios,lodash,fontawesome');


		let dynamicFile;
		dynamicFile = new DynamicFile('systemPages/home.ejs');
		this.assertEquals("dynamicFileBase", dynamicFile.pathAndFileName, 'systemPages/home.ejs');
		this.assertEquals("dynamicFileType", dynamicFile.type, 'text');

		// dynamicPageFile = new DynamicPageFile('systemPages/showcaseDataLoading.ejs');
		// this.assertEquals("dynamicPageFileBase", dynamicPageFile.pathAndFileName, 'systemPages/showcaseDataLoading.ejs');
		// this.assertEquals("dynamicPageFileType", dynamicPageFile.type, 'ejs');
		// this.assertEquals("dynamicPageFileGetDqlStatements", dynamicPageFile.getDqlStatements().length, 9);



		let loadDqlStatementParser;


		loadDqlStatementParser = new LoadDqlStatementParser('load_pageItems(order by displayOrder) as system_pageItems');
		this.assertEquals("loadDqlStatementParserAllWithOrderBy", loadDqlStatementParser.getSqlStatement(), 'SELECT * FROM pageItems ORDER BY displayOrder');



		loadDqlStatementParser = new LoadDqlStatementParser('load_user(id=2) as currentUser');
		this.assertEquals("loadDqlStatementParserLoadUserKind", loadDqlStatementParser.kind, 'single');
		this.assertEquals("loadDqlStatementParserLoadUserBaseDqlStatement", loadDqlStatementParser.baseDqlStatement, 'user(id=2) as currentUser');
		this.assertEquals("loadDqlStatementParserLoadUserInnerDqlStatement", loadDqlStatementParser.innerDqlStatement, 'user(id=2)');
		this.assertEquals("loadDqlStatementParserLoadUserRecordVariableName", loadDqlStatementParser.recordVariableName, 'currentUser');
		this.assertEquals("loadDqlStatementParserLoadUserSqlChunk", loadDqlStatementParser.sqlChunk, 'id=2');
		this.assertEquals("loadDqlStatementParserLoadUserWhereChunk", loadDqlStatementParser.whereChunk, 'id=2');
		this.assertEquals("loadDqlStatementParserLoadUserOrderByChunk", loadDqlStatementParser.orderByChunk, '');
		this.assertEquals("loadDqlStatementParserLoadUserGetSqlStatement", loadDqlStatementParser.getSqlStatement(), 'SELECT * FROM users WHERE id=2');
		this.assertEquals("loadDqlStatementParserLoadUserGenre", loadDqlStatementParser.genre, 'dynamic');

		loadDqlStatementParser = new LoadDqlStatementParser('load_richUserRecords as richItems');
		this.assertEquals("loadDqlStatementParserRichUserRecordsKind", loadDqlStatementParser.kind, 'plural');
		this.assertEquals("loadDqlStatementParserRichUserRecordsBaseDqlStatement", loadDqlStatementParser.baseDqlStatement, 'richUserRecords as richItems');
		this.assertEquals("loadDqlStatementParserRichUserRecordsInnerDqlStatement", loadDqlStatementParser.innerDqlStatement, 'richUserRecords');
		this.assertEquals("loadDqlStatementParserRichUserRecordsRecordVariableName", loadDqlStatementParser.recordVariableName, 'richItems');
		this.assertEquals("loadDqlStatementParserRichUserRecordsSqlChunk", loadDqlStatementParser.sqlChunk, '');
		this.assertEquals("loadDqlStatementParserRichUserRecordsWhereChunk", loadDqlStatementParser.whereChunk, '');
		this.assertEquals("loadDqlStatementParserRichUserRecordsOrderByChunk", loadDqlStatementParser.orderByChunk, '');
		this.assertEquals("loadDqlStatementParseRichUserRecordsGenre", loadDqlStatementParser.genre, 'custom');
		this.assertEquals("loadDqlStatementParseRichUserRecordsGetSqlStatement", loadDqlStatementParser.getSqlStatement(), '');

		loadDqlStatementParser = new LoadDqlStatementParser('load_pageItems(all)');
		this.assertEquals("loadDqlStatementParserLoadPageItemsKind", loadDqlStatementParser.kind, 'plural');
		this.assertEquals("loadDqlStatementParserLoadPageItemsBaseDqlStatement", loadDqlStatementParser.baseDqlStatement, 'pageItems(all)');
		this.assertEquals("loadDqlStatementParserLoadPageItemsInnerDqlStatement", loadDqlStatementParser.innerDqlStatement, 'pageItems(all)');
		this.assertEquals("loadDqlStatementParserLoadPageItemsRecordVariableName", loadDqlStatementParser.recordVariableName, 'pageItems');
		this.assertEquals("loadDqlStatementParserLoadPageItemsSqlChunk", loadDqlStatementParser.sqlChunk, '');
		this.assertEquals("loadDqlStatementParserLoadPageItemsWhereChunk", loadDqlStatementParser.whereChunk, '');
		this.assertEquals("loadDqlStatementParserLoadPageItemsOrderByChunk", loadDqlStatementParser.orderByChunk, '');
		this.assertEquals("loadDqlStatementParserLoadPageItemsGetSqlStatement", loadDqlStatementParser.getSqlStatement(), 'SELECT * FROM pageItems');
		this.assertEquals("loadDqlStatementParserLoadPageItemsGenre", loadDqlStatementParser.genre, 'dynamic');

		loadDqlStatementParser = new LoadDqlStatementParser('load_users(id > 2 order by id desc) as upperUsers');
		this.assertEquals("loadDqlStatementParserLoadUsersKind", loadDqlStatementParser.kind, 'plural');
		this.assertEquals("loadDqlStatementParserLoadUsersBaseDqlStatement", loadDqlStatementParser.baseDqlStatement, 'users(id > 2 order by id desc) as upperUsers');
		this.assertEquals("loadDqlStatementParserLoadUsersInnerDqlStatement", loadDqlStatementParser.innerDqlStatement, 'users(id > 2 order by id desc)');
		this.assertEquals("loadDqlStatementParserLoadUsersRecordVariableName", loadDqlStatementParser.recordVariableName, 'upperUsers');
		this.assertEquals("loadDqlStatementParserLoadUsersSqlChunk", loadDqlStatementParser.sqlChunk, 'id > 2 order by id desc');
		this.assertEquals("loadDqlStatementParserLoadUsersWhereChunk", loadDqlStatementParser.whereChunk, 'id > 2');
		this.assertEquals("loadDqlStatementParserLoadUsersOrderByChunk", loadDqlStatementParser.orderByChunk, 'id DESC');
		this.assertEquals("loadDqlStatementParserLoadUsersGetSqlStatement", loadDqlStatementParser.getSqlStatement(), 'SELECT * FROM users WHERE id > 2 ORDER BY id DESC');
		this.assertEquals("loadDqlStatementParserLoadUsersGenre", loadDqlStatementParser.genre, 'dynamic');


		this.assertEquals("qstrGetFunctionAndParameterLineSimple", qstr.getFunctionAndParameterLine("load_pageItems(all)"), ["load_pageItems", "all"]);
		this.assertEquals("qstrGetFunctionAndParameterLine", qstr.getFunctionAndParameterLine("load_pageItems(all)"), ["load_pageItems", "all"]);

		this.assertEquals("qstrChopLeft", qstr.chopLeft('(whatever', '('), 'whatever');
		this.assertEquals("qstrChopLeft", qstr.chopLeft('932. this is a test', '932. '), 'this is a test');
		this.assertEquals("qstrChopRight", qstr.chopRight('this is a test]', ']'), 'this is a test');
		this.assertEquals("qstrChopRight", qstr.chopRight('this is a test)))', ')))'), 'this is a test');

		this.assertEquals("qstrForceTextNotationFromCamelNotation", qstr.forceTextNotation("dataTypeIdCode"), "data type id code");
		this.assertEquals("qstrForceTextNotationFromTitleNotation", qstr.forceTextNotation("Data Type Id Code"), "data type id code");
		this.assertEquals("qstrForceTextNotationFromPascalNotation", qstr.forceTextNotation("DataTypeIdCode"), "data type id code");
		this.assertEquals("qstrForceTextNotationFromTextNotation", qstr.forceTextNotation("data type id code"), "data type id code");
		this.assertEquals("qstrForceTextNotationTrimsCorrectly", qstr.forceTextNotation("testing "), "testing");
		this.assertEquals("qstrForceTextNotationFromAllCaps", qstr.forceTextNotation("THIS IS A TEST"), "this is a test");
		this.assertEquals("qstrForceTextNotationFromTitle", qstr.forceTextNotation("This is a test"), "this is a test");
		this.assertEquals("qstrForceTextNotationWithBadCharacters", qstr.forceTextNotation("Project 1: The First Section"), "project 1: the first section");
		this.assertEquals("qstrForceTextNotationWithForeignCharacters", qstr.forceTextNotation("Die fröhliche Wissenschaft "), "die fröhliche wissenschaft");

		this.assertEquals("qstrForcePascalNotationfromTitleNotation", qstr.forcePascalNotation("First Name"), "FirstName");
		this.assertEquals("qstrForcePascalNotationfromCamelNotation", qstr.forcePascalNotation("firstName"), "FirstName");
		this.assertEquals("qstrForcePascalNotationfromTextNotation", qstr.forcePascalNotation("first name"), "FirstName");
		this.assertEquals("qstrForcePascalNotationfromPascalNotation", qstr.forcePascalNotation("FirstName"), "FirstName");
		this.assertEquals("qstrForcePascalNotationWithBadCharacters", qstr.forcePascalNotation("Project 1: The First Section"), "Project1TheFirstSection");
		this.assertEquals("qstrForcePascalNotationWithForeignCharacters", qstr.forcePascalNotation("Die fröhliche Wissenschaft"), "DieFroehlicheWissenschaft");
		this.assertEquals("qstrForcePascalNotationWithIdCode", qstr.forcePascalNotation("ID-Code"), "IdCode");

		this.assertEquals("qstrForceTitleNotationFromCamelNotation", qstr.forceTitleNotation("theFirstChapter"), "The First Chapter");
		this.assertEquals("qstrForceTitleNotationFromPascalNotation", qstr.forceTitleNotation("TheFirstChapter"), "The First Chapter");
		this.assertEquals("qstrForceTitleNotationFromTextNotation", qstr.forceTitleNotation("the first chapter"), "The First Chapter");
		this.assertEquals("qstrForceTitleNotationFromTitleNotation", qstr.forceTitleNotation("The First Chapter"), "The First Chapter");
		this.assertEquals("qstrForceTitleNotationAcronym", qstr.forceTitleNotation("UPS"), "UPS");
		this.assertEquals("qstrForceTitleNotationLowerToTitle", qstr.forceTitleNotation("the beginning of a good thing"), "The Beginning of a Good Thing");
		this.assertEquals("qstrForceTitleNotationAllCapsToTitle", qstr.forceTitleNotation("THE BEGINNING OF A GOOD THING"), "The Beginning of a Good Thing");
		this.assertEquals("qstrForceTitleNotationWithBadCharacters", qstr.forceTitleNotation("project 1: the first section"), "Project 1: The First Section");
		this.assertEquals("qstrForceTitleNotationWithForeignCharacters", qstr.forceTitleNotation("Die fröhliche Wissenschaft"), "Die Fröhliche Wissenschaft");

		// TODO: fixForceTitleWithAcronyms
		// this.assertEquals("acronymTitle", qstr.forceTitleNotation("Showcase: Display Data from SQL Statement"), "nnn");
		// this.assertEquals("acronymText", qstr.forceTextNotation("Showcase: Display Data from SQL Statement"), "nnn");
		// this.assertEquals("acronymCamel", qstr.forceCamelNotation("Showcase: Display Data from SQL Statement"), "nnn");
		// this.assertEquals("acronymPascal", qstr.forcePascalNotation("Showcase: Display Data from SQL Statement"), "nnn");

		this.assertEquals("qstrForceCamelNotationfromTitleNotation", qstr.forceCamelNotation("Data Type Id Code"), "dataTypeIdCode");
		this.assertEquals("qstrForceCamelNotationfromCamelNotation", qstr.forceCamelNotation("dataTypeIdCode"), "dataTypeIdCode");
		this.assertEquals("qstrForceCamelNotationfromTextNotation", qstr.forceCamelNotation("data type id code"), "dataTypeIdCode");
		this.assertEquals("qstrForceCamelNotationfromPascalNotation", qstr.forceCamelNotation("DataTypeIdCode"), "dataTypeIdCode");
		this.assertEquals("qstrForceCamelNotationWithBadCharacters", qstr.forceCamelNotation("Project 1: The First Section"), "project1TheFirstSection");
		this.assertEquals("qstrForceCamelNotationWithForeignCharacters", qstr.forceCamelNotation("Die fröhliche Wissenschaft"), "dieFroehlicheWissenschaft");
		this.assertEquals("qstrForceCamelNotationWithIdCode", qstr.forceCamelNotation("ID-Code"), "idCode");
		this.assertEquals("qstrForceCamelNotationWithIdCode", qstr.forceCamelNotation("JSX"), "jsx");
		this.assertEquals("qstrForceCamelNotationWithIdCode", qstr.forceCamelNotation("HTML"), "html");
		this.assertEquals("qstrForceCamelNotationWithIdCode", qstr.forceCamelNotation("single-page"), "singlePage");


		this.assertEquals("qstrForceTextNotationBlank", qstr.forceTextNotation(""), "");
		this.assertEquals("qstrForceCamelNotationBlank", qstr.forceCamelNotation(""), "");


		this.assertEquals("qstrIsUppercaseLetterPositive", qstr.isUppercaseLetter("A"), true);
		this.assertEquals("qstrIsUppercaseLetterNegative", qstr.isUppercaseLetter("a"), false);
		this.assertEquals("qstrIsUppercaseLetterBadCharacter", qstr.isUppercaseLetter(":"), false);
		this.assertEquals("qstrIsUppercaseLetterWord", qstr.isUppercaseLetter("THIS"), false);

		this.assertEquals("qstrIsLowercaseLetterPositive", qstr.isLowercaseLetter("a"), true);
		this.assertEquals("qstrIsLowercaseLetterNegative", qstr.isLowercaseLetter("A"), false);
		this.assertEquals("qstrIsLowercaseLetterBadCharacter", qstr.isLowercaseLetter(":"), false);
		this.assertEquals("qstrIsLowercaseLetterWord", qstr.isLowercaseLetter("this"), false);

		this.assertEquals("qstrIsAllUppercasePositive", qstr.isAllUppercase("FIRST NAME"), true);
		this.assertEquals("qstrIsAllUppercaseNegative", qstr.isAllUppercase("First Name"), false);

		this.assertEquals("qstrInsertSpaceBeforeEveryUppercaseCharacter", qstr.insertSpaceBeforeEveryUppercaseCharacter("weAreTestingHere"), "we Are Testing Here");
		this.assertEquals("qstrInsertSpaceBeforeEveryUppercaseCharacterWithSingleLetterWords", qstr.insertSpaceBeforeEveryUppercaseCharacter("thisIsATestThatIAmDoing"), "this Is A Test That I Am Doing");

		this.assertEquals("qstrCleanForCamelAndPascalNotationBadCharacter", qstr.cleanForCamelAndPascalNotation("Project 1: The First Section"), "Project 1 The First Section");
		this.assertEquals("qstrCleanForCamelAndPascalNotationForeignCharacter", qstr.cleanForCamelAndPascalNotation("Die fröhliche Wissenschaft"), "Die froehliche Wissenschaft");
		this.assertEquals("qstrCleanForCamelAndPascalNotationForeignCharactersAllGerman", qstr.cleanForCamelAndPascalNotation("ßäöüÄÖÜ"), "ssaeoeueAEOEUE");

	}

	testAll() {
		if (this.verbose) {
			console.log(`UNIT TESTS:`);
			console.log(`----------------------`);
		}

		this.internal_runTests();

		if (this.verbose) {
			console.log(`----------------------`);
		}
		if (this.numberFailed == 0) {
			console.log(`(all unit tests succeeded: ${this.numberSucceeded + this.numberFailed} of ${this.numberSucceeded + this.numberFailed})`);
		} else {
			console.log(`UNIT TESTS: ${this.numberFailed} of ${this.numberSucceeded + this.numberFailed} failed`);
		}
		console.log('');
	}

	assertEquals(name, received, expected) {

		let theyAreEqual = false;
		if (Array.isArray(received) && Array.isArray(expected)) {
			theyAreEqual = _.isEqual(received, expected);
		} else {
			theyAreEqual = received == expected;
		}

		if (theyAreEqual) {
			this.numberSucceeded++;
			if (this.verbose) {
				console.log(`[${name}] OK`);
			}
		} else {
			this.numberFailed++;
			if (this.verbose) {
				console.log(`!!! [${name}] FAILED:`);
			} else {
				console.log(`!!! UNIT TEST FAILED: [${name}]:`);
			}

			console.log(`  expected: [${expected}]`);
			console.log(`  received: [${received}] `);
		}
	}
}

module.exports = UnitTester;