"use strict";
const express = require('express');
const qstr = require('./qtools/qstr');
const qsys = require('./qtools/qsys');
const qarr = require('./qtools/qarr');
const qdev = require('./qtools/qdev');
const config = require('./system/config');
const UnitTester = require('./systemClasses/unitTester');
const DqlDataLoader = require('./systemClasses/dqlDataLoader');
const DynamicPageFile = require('./systemClasses/dynamicPageFile');
const controllerFactory = require('./systemFactories/controllerFactory');
const fs = require('fs');
const app = express();
const bodyParser = require("body-parser");
const session = require('express-session');
const DynamicFile = require('./systemClasses/dynamicFile');
const DpDataLoader = require('./systemClasses/dpDataLoader');
const ShowcaseDataAccessManager = require('./systemClasses/showcaseDataAccessManager');
var md5 = require('md5');
const DynamicPagePresenter = require('./systemClasses/dynamicPagePresenter');

app.use(bodyParser.urlencoded({
	limit: '200mb', extended: true
}));
app.use(bodyParser.json({ limit: '200mb' }))

app.set('view engine', 'ejs');

app.use(session({
	secret: '123123',
	resave: true,
	saveUninitialized: true
}));
let sess;

// handle controllers
app.post('/controller*', function (request, response) {
	const controllerIdCode = qstr.chopLeft(request.path, '/');
	//console.log(request.session);
	const controller = controllerFactory.instantiate(controllerIdCode, request, response);
	controller.process();
});

// SHOWCASE FOR DATABASE ACCESS FUNCTIONALITY ==========================================
//ShowcaseDataAccessManager.TestAll(); // showcaseDataLoading
// ===========================================================================


// =============================================

app.use(express.static(__dirname + '/public'));


//avoids graphics being processed below
app.get('*.png', function (request, response) { });
app.get('*.jpg', function (request, response) { });
app.get('*.gif', function (request, response) { });

//console.log(md5('nnn'));
app.get('*', function (request, response) {


	//do not allow developing mode online
	if (config.developing() && qsys.isOnline()) {

		const dynamicPage = new DynamicFile('system/config.js');
		dynamicPage.changeMarkerLineAndSave('defaultUserIdCode', "return 'anonymousUser';");
		dynamicPage.changeMarkerLineAndSave('configDeveloping', "return false;");
		throw new Error('online dev detected and fixed, restart node');
	}




	let currentPageItemIdCode = qstr.chopLeft(request.path, "/");

	if (currentPageItemIdCode != 'favicon.ico') {

		const currentUserIdCode = qsys.getCurrentUserIdCode(request);

		if (currentPageItemIdCode == "") {
			currentPageItemIdCode = config.basePageIdCode();
		}

		let currentPagePathAndFileName = qsys.buildPathAndFileName(currentPageItemIdCode);

		const homeDynamicPageFile = DynamicPageFile.instantiateWithPageItemIdCode('home');

		// define layout of site
		let layout = homeDynamicPageFile.getDataFromVariableLine('layout');
		if (qstr.isEmpty(layout)) {
			layout = config.layout();
		}

		// define if e.g. developer panel is shown
		let developer;
		let developerAsString = homeDynamicPageFile.getDataFromVariableLine('developer');
		if (qstr.isEmpty(developerAsString)) {
			developer = config.developer();
		} else {
			developer = qstr.IsAffirmative(developerAsString); // "yes" becomes true, "no" becomes false
		}

		const dynamicPageFile = new DynamicPageFile(currentPagePathAndFileName);
		const dqlStatements = dynamicPageFile.getDqlStatements();
		const extensionIdCodes = dynamicPageFile.getExtensionIdCodes();

		dqlStatements.push(`load_user(login="${currentUserIdCode}") as system_currentUser`);
		dqlStatements.push('load_pageItems(order by displayOrder) as allPageItems');
		dqlStatements.push(`load_pageItem(idCode='${currentPageItemIdCode}') as system_currentPageItem`);
		dqlStatements.push('load_techItems() as techItems');
		dqlStatements.push('load_techTopicGroups() as techTopicGroups');



		const dqlDataLoader = new DqlDataLoader(dqlStatements);
		dqlDataLoader.load(function (data) {

			data.system_user_deflected = false;
			data.system_message = '';
			data.system_allowedPageItems = qsys.buildAllowedPageItems(data.allPageItems, data.system_currentUser);
			data.system_mainMenuPageItems = qsys.buildMenuPageItems('main', data.system_allowedPageItems, request);
			data.system_submainMenuPageItems = qsys.buildMenuPageItems('submain', data.system_allowedPageItems, request);
			data.system_developerCustomManageMenuPageItems = qsys.buildMenuPageItems('developerCustomManage', data.system_allowedPageItems, request);
			data.system_developerMainMenuPageItems = qsys.buildMenuPageItems('developerMain', data.system_allowedPageItems, request);
			data.system_developerSystemManageMenuPageItems = qsys.buildMenuPageItems('developerSystemManage', data.system_allowedPageItems, request);

			data.system_developerShowcaseMenuPageItems = qsys.buildMenuPageItems('developerShowcase', data.system_allowedPageItems, request);
			data.system_developerShowcaseMenuPageItems = qarr.multisort(data.system_developerShowcaseMenuPageItems, ['title'], ['asc']);

			data.system_developerSeldomMenuPageItems = qsys.buildMenuPageItems('developerSeldom', data.system_allowedPageItems, request);

			data.system_loginAreaMenuPageItems = qsys.buildMenuPageItems('loginArea', data.system_allowedPageItems, request);

			data.system_totalNumberOfDeveloperPages = 999; //TODO: fix (now always shows) data.system_devToolMenuPageItems.length + data.system_devShowcaseMenuPageItems.length + data.system_devOtherMenuPageItems.length; 

			data.system_isOnline = qsys.isOnline();

			data.system_siteMode = config.siteMode();

			// deflect user if they are on an unallowed page
			if (!qsys.userHasAccessToPage(data.system_currentUser, data.system_currentPageItem)) {
				data.system_message = `You tried to access the page <b>${data.system_currentPageItem.title}</b> but do not have sufficient rights to view it. Please <a href="login">log in as a user with sufficient rights</a> and try again.`;
				currentPageItemIdCode = 'home';
				currentPagePathAndFileName = qsys.buildPathAndFileName(currentPageItemIdCode);
				data.system_currentPageItem = qsys.getPageItemFromCollection(data.system_allowedPageItems, 'home');

				data.system_user_deflected = true;
			}

			// add information to current page so that links to page render correct title and preview information
			const dynamicPagePresenter = new DynamicPagePresenter(data.system_currentPageItem, request, data.techItems, data.techTopicGroups); // NEXTVERSION
			data.system_currentPageItem = dynamicPagePresenter.enhancedPageItem();

			data.system_userIsCurrentlyLoggedIn = qsys.userIsCurrentlyLoggedIn(request);

			data.system_configDeveloping = config.developing();
			data.system_developingAllowedBrowserSignature = config.developingAllowedBrowserSignature();

			data.system_layout_header = `../systemLayouts/systemLayout_${layout}_header`;
			data.system_layout_footer = `../systemLayouts/systemLayout_${layout}_footer`;
			data.system_extensionIdCodes = extensionIdCodes;
			data.system_layout = layout;
			data.system_menu_title = config.getApplicationShortTitle(); //data.system_userIsCurrentlyLoggedIn ? data.system_currentUser.firstName : config.getApplicationShortTitle();
			data.system_developer = developer;
			data.system_developing = config.developing();
			data.system_availableExtensionIdCodes = config.availableExtensionIdCodes();
			data.system_currentPageItemIdCode = currentPageItemIdCode;
			data.system_frontendLibraryPaths = config.getFrontendLibraryPaths();

			qsys.currentUserIsDeveloper(request, function (userIsDeveloper) {
				data.system_userIsDeveloper = userIsDeveloper;
				if (fs.existsSync(currentPagePathAndFileName)) {
					response.render(currentPagePathAndFileName, {
						data: data
					});
				}
			});
		});

	}

});

const server = app.listen(config.port(), function () {
	const port = server.address().port
	console.log("Now listening at http://localhost:%s", port)
});

// ---------- development

if (config.developing) {
	const unitTester = new UnitTester();
	unitTester.testAll();
}