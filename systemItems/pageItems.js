"use strict"
const Items = require('../systemItems/items');

class PageItems extends Items {

	getItemTypeDefinitionBlock() {
		return `
        ** Page Items    
        ID-Code
        Menu
        Title
        Description;p 
        Kind
        Subsite
        Type
        Access Groups;list
		Display Order;wn
		Hold Menu
        `;
	}

	getItemTypeDefinitionBlock() {
		return `
        ** Page Items    
		idCode
		*Menu; choice; $choices = main - top row visible[main], submain - under "More" dropdown[submain], developerMain - first section under developer dropdown[developerMain], developerSystemManage - where all the Manage Item Type pages are listed[developerSystemManage], developerShowcase - for all showcases[developerShowcase],  developerSeldom - at very bottom of developer dropdown for all other developer pages[developerSeldom], hide - don't show it anywhere[hide], loginArea - for login and logout[loginArea]
		*Title
		Description;p
		*Kind;$info=This is "custom" or "system" and will be used to determine which pages belong to the base website (system) and which were added by the user (custom). This will be used by a feature that makes it easy to upgrade a site to a new version, e.g. zippipng all custom pages and itemTypes, and then importing them into a Datapod with a new version.
		*Subsite;$info=Normally this will be "core" but it is used to house multiple sites in one site, switching between then, so that you can work in one code base but export to multiple sites.
		Type;$info=This is for future use, e.g. "html" or "vuejs" to describe the kind of front end the page is, currently not used.
		*Access Groups;list;$info=This controls access to a page, e.g. if a user logs in and has "developers,administrators" in their accessCodes, then they will be able to see all pages with either "developers" or "administrators" in the page's accessCodes field.
		*Display Order;wn;$info=This is the order the page appears in its menu section. This is a number, e.g. 10, 20, 30, etc.
		Hold Menu
        `;
	}



	/*
idCode
*Menu; choice; $choices = main - top row visible[main], submain - under "More" dropdown[submain], developerMain - first section under developer dropdown[developerMain], developerSystemManage - where all the Manage Item Type pages are listed[developerSystemManage], developerShowcase - for all showcases[developerShowcase],  developerSeldom - at very bottom of developer dropdown for all other developer pages[developerSeldom], hide - don't show it anywhere[hide]
*Title
Description;p
*Kind;$info=this is "custom" or "system" and will be used to determine which pages belong to the base website (system) and which were added by the user (custom). This will be used by a feature that makes it easy to upgrade a site to a new version, e.g. zippipng all custom pages and itemTypes, and then importing them into a Datapod with a new version.
*Subsite;$info=Normally this will be "core" but it is used to house multiple sites in one site, switching between then, so that you can work in one code base but export to multiple sites.
Type;$info=This is for future use, e.g. "html" or "vuejs" to describe the kind of front end the page is, currently not used.
*Access Groups;list;$info=This controls access to a page, e.g. if a user logs in and has "developers,administrators" in their accessCodes, then they will be able to see all pages with either "developers" or "administrators" in the page's accessCodes field.
*Display Order;wn;$info=This is the order the page appears in its menu section. This is a number, e.g. 10, 20, 30, etc.
	*/

	constructor(loadIdCode) {
		super(loadIdCode);
		this.itemTypeIdCode = 'pageItems';
		this.loadItems();
	}

	// loadItems() {
	//     super.loadItems();
	//     switch(this.loadIdCode) {
	//         case 'mainMenu':
	//             this.records = this.fetch_recordsWithWhereChunk('menu = "main"');
	//             return;
	//     }

	// }

}

module.exports = PageItems