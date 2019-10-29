"use strict"
const qstr = require('../qtools/qstr');
const qsys = require('../qtools/qsys');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const fs = require('fs');
const config = require('../system/config');

class DynamicPagePresenter {

	constructor(pageItem, request, techItems, techTopicGroups) {
		this.pageItem = pageItem;
		const urlInfo = qsys.getUrlInfo(request);
		this.pageIdCode = urlInfo.pageIdCode;
		this.params = urlInfo.params;
		this.techItems = techItems;
		this.techTopicGroups = techTopicGroups;
		this.process();
	}

	process() {
		switch (this.pageIdCode) {
			case 'techItems':
				this.processTechItemPage();
				break;
			default:
				//this.pageItem.title = 'Web Tech: ' + this.pageItem.title;
				break;
		}
	}

	processTechItemPage() {
		//const prefix = 'Web Tech: ';
		const prefix = '';

		if (!qstr.isEmpty(this.params.id)) {
			const title = this.techItems.find(m => m.id == this.params.id).title;
			this.pageItem.title = prefix + title;
		}

		if (!qstr.isEmpty(this.params.groupIdCode)) {
			const topicGroup = this.techTopicGroups.find(m => m.idCode == this.params.groupIdCode);
			const title = qstr.isEmpty(topicGroup) ? '' : topicGroup.title;
			this.pageItem.title = prefix + title;
		}

	}

	enhancedPageItem() {
		return this.pageItem;
	}

}

module.exports = DynamicPagePresenter