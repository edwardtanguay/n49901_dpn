"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qstr = require('../qtools/qstr');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const axios = require('axios');
const cheerio = require('cheerio');

class ControllerShowcaseScreenScraping extends Controller {
	constructor(request, response) {
		super(request, response);
	}

	action_loadPageData() {
		this.responseStatus = 'loaded';
		this.responseData = {};

		const url = `https://news.ycombinator.com`;
		axios.get(url)
			.then(response => {
				this.responseData.linkItems = this.getHackerNewsData(response.data);
				this.sendResponse();
			})
			.catch(error => {
				console.log(error);
			});
	}

	getHackerNewsData(html) {
		const data = [];
		const $ = cheerio.load(html);
		$('table.itemlist tr td:nth-child(3)').each((i, elem) => {
			data.push({
				title: $(elem).text(),
				link: $(elem).find('a.storylink').attr('href')
			});
		});
		return data;
	}

	
}

module.exports = ControllerShowcaseScreenScraping