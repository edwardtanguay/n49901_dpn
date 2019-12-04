const Controller = require('../systemControllers/controller');
//DYNAMIC_CODE_AREA:loadClasses
const ControllerShowcaseFormAndAjaxControls = require('../systemControllers/controllerShowcaseFormAndAjaxControls'); //:pageShowcaseFormAndAjaxControls
const ControllerDeletePage = require('../systemControllers/controllerDeletePage'); //:deletePage
const ControllerCreatePage = require('../systemControllers/controllerCreatePage'); //:createPage
const ControllerShowcaseTextParser = require('../systemControllers/controllerShowcaseTextParser'); //:showcaseTextParser
const ControllerCreateClass = require('../systemControllers/controllerCreateClass'); //:createClass
const ControllerShowcaseFormToEditDatabase = require('../systemControllers/controllerShowcaseFormToEditDatabase'); //:showcaseFormToEditDatabase
const ControllerShowcaseParseItemTypeDefinitionBlock = require('../systemControllers/controllerShowcaseParseItemTypeDefinitionBlock'); //:showcaseParseItemTypeDefinitionBlock
const ControllerShowcaseFormCodeBlocks = require('../systemControllers/controllerShowcaseFormCodeBlocks'); //:showcaseFormCodeBlocks
const ControllerLogout = require('../systemControllers/controllerLogout'); //:logout
const ControllerLogin = require('../systemControllers/controllerLogin'); //:login
const ControllerShowcaseCreatePdf = require('../systemControllers/controllerShowcaseCreatePdf'); //:showcaseCreatePdf
const ControllerShowcaseCreatePdfReport = require('../systemControllers/controllerShowcaseCreatePdfReport'); //:showcaseCreatePdfReport
const ControllerShowcaseJavaScriptSorting = require('../systemControllers/controllerShowcaseJavaScriptSorting'); //:showcaseJavaScriptSorting
const ControllerShowcaseReadXmlFile = require('../systemControllers/controllerShowcaseReadXmlFile'); //:showcaseReadXmlFile
const ControllerCreateItemType = require('../systemControllers/controllerCreateItemType'); //:createItemType
const ControllerShowcaseDpDataLoader = require('../systemControllers/controllerShowcaseDpDataLoader'); //:showcaseDpDataLoader
const ControllerShowcaseDisplayDataFromSqlStatement = require('../systemControllers/controllerShowcaseDisplayDataFromSqlStatement'); //:showcaseDisplayDataFromSqlStatement
const ControllerCreatePageBuilder = require('../systemControllers/controllerCreatePageBuilder'); //:createPageBuilder
const ControllerDeleteItemType = require('../systemControllers/controllerDeleteItemType'); //:deleteItemType
const ControllerShowcaseCreateShowcaseBook = require('../systemControllers/controllerShowcaseCreateShowcaseBook'); //:showcaseCreateShowcaseBook
const ControllerShowcaseMarkdown = require('../systemControllers/controllerShowcaseMarkdown'); //:showcaseMarkdown
const ControllerShowcaseCustomTextParsing = require('../systemControllers/controllerShowcaseCustomTextParsing'); //:showcaseCustomTextParsing
const ControllerShowcaseTextChunkDocument = require('../systemControllers/controllerShowcaseTextChunkDocument'); //:showcaseTextChunkDocument
const ControllerBatchImport = require('../systemControllers/controllerBatchImport'); //:batchImport
const ControllerShowcaseDql = require('../systemControllers/controllerShowcaseDql'); //:showcaseDql
const ControllerManagePageItems = require('../systemControllers/controllerManagePageItems'); //:managePageItems
const ControllerManagePageItem = require('../systemControllers/controllerManagePageItem'); //:managePageItem
const ControllerManageShowcaseBook = require('../systemControllers/controllerManageShowcaseBook'); //:manageShowcaseBook
const ControllerManageUsers = require('../systemControllers/controllerManageUsers'); //:manageUsers
const ControllerManageUser = require('../systemControllers/controllerManageUser'); //:manageUser
const ControllerShowcaseBestEcmascript6Features = require('../systemControllers/controllerShowcaseBestEcmascript6Features'); //:showcaseBestEcmascript6Features
const ControllerShowcaseEditXmlFile = require('../systemControllers/controllerShowcaseEditXmlFile'); //:showcaseEditXmlFile
const ControllerManageItemTypes = require('../systemControllers/controllerManageItemTypes'); //:manageItemTypes
const ControllerManageItemType = require('../systemControllers/controllerManageItemType'); //:manageItemType
const ControllerShowcaseMultipleSqlStatements = require('../systemControllers/controllerShowcaseMultipleSqlStatements'); //:showcaseMultipleSqlStatements
const ControllerShowcaseMultipleAjaxSteps = require('../systemControllers/controllerShowcaseMultipleAjaxSteps'); //:showcaseMultipleAjaxSteps
const ControllerShowcaseMultipleAjaxStepsWithNodeRestarts = require('../systemControllers/controllerShowcaseMultipleAjaxStepsWithNodeRestarts'); //:showcaseMultipleAjaxStepsWithNodeRestarts
const ControllerShowcaseSearchAndDisplayItemType = require('../systemControllers/controllerShowcaseSearchAndDisplayItemType'); //:showcaseSearchAndDisplayItemType
const ControllerCreateDataType = require('../systemControllers/controllerCreateDataType'); //:createDataType
const ControllerShowcaseUser = require('../systemControllers/controllerShowcaseUser'); //:showcaseUser
const ControllerAddFieldToItemType = require('../systemControllers/controllerAddFieldToItemType'); //:addFieldToItemType
const ControllerManageShowcaseUsers = require('../systemControllers/controllerManageShowcaseUsers'); //:manageShowcaseUsers
const ControllerManageShowcaseUser = require('../systemControllers/controllerManageShowcaseUser'); //:manageShowcaseUser
const ControllerShowcasePageState = require('../systemControllers/controllerShowcasePageState'); //:showcasePageState
const ControllerShowcaseMobileDevelopment = require('../systemControllers/controllerShowcaseMobileDevelopment'); //:showcaseMobileDevelopment
const ControllerShowcaseEs6Promise = require('../systemControllers/controllerShowcaseEs6Promise'); //:showcaseEs6Promise
const ControllerShowcaseLoadDataWithPromises = require('../systemControllers/controllerShowcaseLoadDataWithPromises'); //:showcaseLoadDataWithPromises
const ControllerShowcaseES6MapFunction = require('../systemControllers/controllerShowcaseES6MapFunction'); //:showcaseES6MapFunction
const ControllerHome = require('../systemControllers/controllerHome'); //:home
const ControllerShowcaseTypeScript = require('../systemControllers/controllerShowcaseTypeScript'); //:showcaseTypeScript
const ControllerShowcaseSliders = require('../systemControllers/controllerShowcaseSliders'); //:showcaseSliders
const ControllerShowcaseRegex = require('../systemControllers/controllerShowcaseRegex'); //:showcaseRegex
const ControllerShowcaseRegexParser = require('../systemControllers/controllerShowcaseRegexParser'); //:showcaseRegexParser
const ControllerShowcaseScreenScraping = require('../systemControllers/controllerShowcaseScreenScraping'); //:showcaseScreenScraping
const ControllerShowcaseLoadDataWithMultiplePromises = require('../systemControllers/controllerShowcaseLoadDataWithMultiplePromises'); //:showcaseLoadDataWithMultiplePromises
const ControllerShowcaseLoadFromMultipleDataSources = require('../systemControllers/controllerShowcaseLoadFromMultipleDataSources'); //:showcaseLoadFromMultipleDataSources
const ControllerSystemDeveloperPanel = require('../systemControllers/controllerSystemDeveloperPanel');


exports.instantiate = function (controllerIdCode, request, response) {
	switch (controllerIdCode) {
		case 'controller':
			return new Controller(request, response);
		//DYNAMIC_CODE_AREA:switchBlock,2
		case 'controllerShowcaseFormAndAjaxControls': //:pageShowcaseFormAndAjaxControls
			return new ControllerShowcaseFormAndAjaxControls(request, response);
		case 'controllerDeletePage': //:deletePage
			return new ControllerDeletePage(request, response);
		case 'controllerCreatePage': //:createPage
			return new ControllerCreatePage(request, response);
		case 'controllerShowcaseTextParser': //:showcaseTextParser
			return new ControllerShowcaseTextParser(request, response);
		case 'controllerCreateClass': //:createClass
			return new ControllerCreateClass(request, response);
		case 'controllerShowcaseFormToEditDatabase': //:showcaseFormToEditDatabase
			return new ControllerShowcaseFormToEditDatabase(request, response);
		case 'controllerShowcaseParseItemTypeDefinitionBlock': //:showcaseParseItemTypeDefinitionBlock
			return new ControllerShowcaseParseItemTypeDefinitionBlock(request, response);
		case 'controllerShowcaseFormCodeBlocks': //:showcaseFormCodeBlocks
			return new ControllerShowcaseFormCodeBlocks(request, response);
		case 'controllerLogout': //:logout
			return new ControllerLogout(request, response);
		case 'controllerLogin': //:login
			return new ControllerLogin(request, response);
		case 'controllerShowcaseCreatePdf': //:showcaseCreatePdf
			return new ControllerShowcaseCreatePdf(request, response);
		case 'controllerShowcaseCreatePdfReport': //:showcaseCreatePdfReport
			return new ControllerShowcaseCreatePdfReport(request, response);
		case 'controllerShowcaseJavaScriptSorting': //:showcaseJavaScriptSorting
			return new ControllerShowcaseJavaScriptSorting(request, response);
		case 'controllerShowcaseReadXmlFile': //:showcaseReadXmlFile
			return new ControllerShowcaseReadXmlFile(request, response);
		case 'controllerCreateItemType': //:createItemType
			return new ControllerCreateItemType(request, response);
		case 'controllerShowcaseDpDataLoader': //:showcaseDpDataLoader
			return new ControllerShowcaseDpDataLoader(request, response);
		case 'controllerShowcaseDisplayDataFromSqlStatement': //:showcaseDisplayDataFromSqlStatement
			return new ControllerShowcaseDisplayDataFromSqlStatement(request, response);
		case 'controllerCreatePageBuilder': //:createPageBuilder
			return new ControllerCreatePageBuilder(request, response);
		case 'controllerDeleteItemType': //:deleteItemType
			return new ControllerDeleteItemType(request, response);
		case 'controllerShowcaseCreateShowcaseBook': //:showcaseCreateShowcaseBook
			return new ControllerShowcaseCreateShowcaseBook(request, response);
		case 'controllerManagePageItems': //:managePageItems
			return new ControllerManagePageItems(request, response);
		case 'controllerManagePageItem': //:managePageItem
			return new ControllerManagePageItem(request, response);
		case 'controllerManageShowcaseBook': //:manageShowcaseBook
			return new ControllerManageShowcaseBook(request, response);
		case 'controllerManageUsers': //:manageUsers
			return new ControllerManageUsers(request, response);
		case 'controllerManageUser': //:manageUser
			return new ControllerManageUser(request, response);
		case 'controllerShowcaseBestEcmascript6Features': //:showcaseBestEcmascript6Features
			return new ControllerShowcaseBestEcmascript6Features(request, response);
		case 'controllerShowcaseEditXmlFile': //:showcaseEditXmlFile
			return new ControllerShowcaseEditXmlFile(request, response);
		case 'controllerManageItemTypes': //:manageItemTypes
			return new ControllerManageItemTypes(request, response);
		case 'controllerManageItemTypes':
			return new ControllerManageItemTypes(request, response);
		case 'controllerManageItemType': //:manageItemType
			return new ControllerManageItemType(request, response);
		case 'controllerShowcaseMultipleSqlStatements': //:showcaseMultipleSqlStatements
			return new ControllerShowcaseMultipleSqlStatements(request, response);
		case 'controllerShowcaseMultipleAjaxSteps': //:showcaseMultipleAjaxSteps
			return new ControllerShowcaseMultipleAjaxSteps(request, response);
		case 'controllerShowcaseMultipleAjaxStepsWithNodeRestarts': //:showcaseMultipleAjaxStepsWithNodeRestarts
			return new ControllerShowcaseMultipleAjaxStepsWithNodeRestarts(request, response);
		case 'controllerShowcaseSearchAndDisplayItemType': //:showcaseSearchAndDisplayItemType
			return new ControllerShowcaseSearchAndDisplayItemType(request, response);
		case 'controllerCreateDataType': //:createDataType
			return new ControllerCreateDataType(request, response);
		case 'controllerShowcaseUser': //:showcaseUser
			return new ControllerShowcaseUser(request, response);
		case 'controllerAddFieldToItemType': //:addFieldToItemType
			return new ControllerAddFieldToItemType(request, response);
		case 'controllerManageShowcaseUsers': //:manageShowcaseUsers
			return new ControllerManageShowcaseUsers(request, response);
		case 'controllerManageShowcaseUsers':
			return new ControllerManageShowcaseUsers(request, response);
		case 'controllerManageShowcaseUser': //:manageShowcaseUser
			return new ControllerManageShowcaseUser(request, response);
		case 'controllerShowcasePageState': //:showcasePageState
			return new ControllerShowcasePageState(request, response);
		case 'controllerShowcaseMobileDevelopment': //:showcaseMobileDevelopment
			return new ControllerShowcaseMobileDevelopment(request, response);
		case 'controllerShowcaseEs6Promise': //:showcaseEs6Promise
			return new ControllerShowcaseEs6Promise(request, response);
		case 'controllerShowcaseLoadDataWithPromises': //:showcaseLoadDataWithPromises
			return new ControllerShowcaseLoadDataWithPromises(request, response);
		case 'controllerShowcaseES6MapFunction': //:showcaseES6MapFunction
			return new ControllerShowcaseES6MapFunction(request, response);
		case 'controllerHome': //:home
			return new ControllerHome(request, response);
		case 'controllerManageSystemTexts': //:manageSystemTexts
			return new ControllerManageSystemTexts(request, response);
		case 'controllerManageSystemText': //:manageSystemText
			return new ControllerManageSystemText(request, response);
		case 'controllerShowcaseTypeScript': //:showcaseTypeScript
			return new ControllerShowcaseTypeScript(request, response);
		case 'controllerShowcaseSliders': //:showcaseSliders
			return new ControllerShowcaseSliders(request, response);
		case 'controllerShowcaseRegex': //:showcaseRegex
			return new ControllerShowcaseRegex(request, response);
		case 'controllerShowcaseRegexParser': //:showcaseRegexParser
			return new ControllerShowcaseRegexParser(request, response);
		case 'controllerShowcaseScreenScraping': //:showcaseScreenScraping
			return new ControllerShowcaseScreenScraping(request, response);
		case 'controllerShowcaseLoadDataWithMultiplePromises': //:showcaseLoadDataWithMultiplePromises
			return new ControllerShowcaseLoadDataWithMultiplePromises(request, response);
		case 'controllerShowcaseLoadFromMultipleDataSources': //:showcaseLoadFromMultipleDataSources
			return new ControllerShowcaseLoadFromMultipleDataSources(request, response);
		case 'controllerShowcaseMarkdown': //:showcaseMarkdown
			return new ControllerShowcaseMarkdown(request, response);
		case 'controllerShowcaseCustomTextParsing': //:showcaseCustomTextParsing
			return new ControllerShowcaseCustomTextParsing(request, response);
		case 'controllerShowcaseTextChunkDocument': //:showcaseTextChunkDocument
			return new ControllerShowcaseTextChunkDocument(request, response);
		case 'controllerFillItemTypesFromDirectory': //:fillItemTypesFromDirectory
			return new ControllerFillItemTypesFromDirectory(request, response);
		case 'controllerSystemCodeGenerator': //:systemCodeGenerator
			return new ControllerSystemCodeGenerator(request, response);
		case 'controllerBatchImport': //:batchImport
			return new ControllerBatchImport(request, response);
		case 'controllerShowcaseDql': //:showcaseDql
			return new ControllerShowcaseDql(request, response);
		case 'controllerCustomTextTransformations': //:customTextTransformations
			return new ControllerCustomTextTransformations(request, response);
		case 'controllerTest111': //:test111
			return new ControllerTest111(request, response);
		case 'controllerSystemDeveloperPanel':
			return new ControllerSystemDeveloperPanel(request, response);
		default:
		// TODO: return some error code that can be processed
	}
}