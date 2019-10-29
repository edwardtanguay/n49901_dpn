"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qstr = require('../qtools/qstr');
const qdat = require('../qtools/qdat');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');

class ControllerShowcaseEs6Promise extends Controller {
	constructor(request, response) {
		super(request, response);
	}

	action_loadPageData() {
		this.responseStatus = 'loaded';
		this.responseData = {};

		const thePromise = new Promise((resolve, reject) => {
			const result = Math.random() * 100;
			if (result <= 50) {
				resolve('promise kept: ' + result);
			}
			reject('promise not kept');
		});

		const onResolved = (resolvedValue) => console.log(resolvedValue);
		const onRejected = (error) => console.log(error);

		thePromise.then(onResolved, onRejected);


		const that = this;
		this.someProcess(1000)
			.then(function () {
				qdev.debug('111');
				return that.someProcess(1000);
			})
			.then(function () {
				qdev.debug('222');
				return that.someProcess(1000);
			})
			.then(function () {
				qdev.debug('333');
			});

		this.responseData.message = 'the message';
		this.sendResponse();
	}

	someProcess(interval) {
		return new Promise(function (resolve) {
			qdev.debug('doing process');
			setTimeout(resolve, interval);
		});
	}

	action_loadData() {
		this.responseStatus = 'loaded';
		this.responseData = {};
		qsys.sleep(1000);
		this.responseData.message2 = 'executed at: ' + qdat.getCurrentDateTime();
		this.sendResponse();
	}
}

module.exports = ControllerShowcaseEs6Promise