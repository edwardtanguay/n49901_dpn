"use strict"
const Items = require('./items');

class ShowcaseBooks extends Items {

	getItemTypeDefinitionBlock() {
		return `
        ** Showcase Books
        Title
        Description;p
        Author
        Number of Pages;numberOfBookPages
        Kind;choice;$choices=Paperback, Hardcover, E-Book[ebook], PDF[pdf]
        Section;choice;$choices=Programming,items Cooking, Travel, History, Philosophy
        `;
	}

	constructor(loadIdCode) {
		super(loadIdCode);
		this.itemTypeIdCode = 'showcaseBooks';
		this.loadItems();
	}

	loadItems() {
		super.loadItems();
		switch (this.loadIdCode) { }

	}

}

module.exports = ShowcaseBooks