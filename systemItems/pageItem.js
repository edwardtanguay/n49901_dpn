"use strict"
const Item = require('../systemItems/item');
const PageItems = require('../systemItems/pageItems');

class PageItem extends Item {
	constructor(id) {
		super(id);
		this.items = new PageItems();
		this.loadItem();
	}

	static instantiateWithRecord(record) {
		const item = new PageItem();
		item.idCode = record['idCode'];
		item.menu = record['menu'];
		item.title = record['title'];
		item.description = record['description'];
		item.kind = record['kind'];
		item.subsite = record['subsite'];
		item.type = record['type'];
		item.accessGroups = record['accessGroups'];
		item.displayOrder = record['displayOrder'];
		item.holdMenu = record['displayOrder'];
		return item;
	}

	static instantiateWithObjectRecord(objectRecord) {
		const item = new PageItem();
		item.idCode = objectRecord.idCode;
		item.menu = objectRecord.menu;
		item.title = objectRecord.title;
		item.description = objectRecord.description;
		item.kind = objectRecord.kind;
		item.subsite = objectRecord.subsite;
		item.type = objectRecord.type;
		item.accessGroups = objectRecord.accessGroups;
		item.displayOrder = objectRecord.displayOrder;
		item.holdMenu = objectRecord.holdMenu;
		return item;
	}

}

module.exports = PageItem