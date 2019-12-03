"use strict"
const Items = require('./items');
const qdat = require('../qtools/qdat');

class TestServers extends Items {

    getItemTypeDefinitionBlock() {
        return `
        ** Test Servers
        *Title
        Notes;outline
        `;
    }

    constructor(loadIdCode) {
        super(loadIdCode);
        this.itemTypeIdCode = 'testServers';
        this.loadItems();
    }

    loadItems() {
        super.loadItems();
        switch (this.loadIdCode) {}

    }

	enhance() {
		for (const item of this.items) {
			item.niceSystemWhenCreated = qdat.getShortMonthWithWeekDay(item.systemWhenCreated);
			item.htmlBody = item.getDefaultHtmlBodyAsTable();
            item.itemTextBlock = item.getItemTextBlock();
		}
	}	

}

module.exports = TestServers