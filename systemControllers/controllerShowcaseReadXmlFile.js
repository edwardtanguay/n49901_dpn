"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdat = require('../qtools/qdat');
const ShowcaseBook = require('../systemItems/showcaseBook');
const parser = require('fast-xml-parser');
const he = require('he');

class ControllerShowcaseReadXmlFile extends Controller {
	constructor(request, response) {
		super(request, response);
	}


	customFormValidation(field, errors) {
		// if (field.idCode == 'title' && qstr.contains(field.value, '.')) {
		//     this.addFormError(field, 'should not contain a period character');
		// }
	}

	action_loadPageData() {
		this.responseStatus = 'loaded';
		this.responseData = {};

		const xmlPathAndFileName = 'showcases/showcaseReadXml.xml';

		const options = {};
		try {
			const xml = qfil.getContentOfDataFile(xmlPathAndFileName);
			var jsonObj = parser.parse(xml, options, true); // will through error if not valid structure

			const json = qfil.getJsonFromDataFile(xmlPathAndFileName);
			const city = json.weatherdata.location.name._text;
			const times = json.weatherdata.forecast.tabular.time;
			const creditText = json.weatherdata.credit.link._attributes.text;
			const creditUrl = json.weatherdata.credit.link._attributes.url;

			const forecasts = [];
			for (const time of times) {
				forecasts.push(
					{
						time: qdat.convertTDateTimeToStandardDateTime(time._attributes.from),
						temperature: time.temperature._attributes.value,
						precipitation: time.precipitation._attributes.value,
						wind: time.windSpeed._attributes.name
					}
				);
			}


			this.responseStatus = 'loaded';
			this.responseData = {
				forecasts: forecasts,
				city: city,
				creditText: creditText,
				creditUrl: creditUrl,
				errorMessage: ''
			};
		} catch (error) {
			this.responseData.errorMessage = error.message;
		} finally {
			this.sendResponse();
		}


	}


}

module.exports = ControllerShowcaseReadXmlFile