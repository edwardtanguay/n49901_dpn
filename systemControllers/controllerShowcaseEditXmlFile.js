"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdat = require('../qtools/qdat');
const ShowcaseBook = require('../systemItems/showcaseBook');

class ControllerShowcaseEditXmlFile extends Controller {
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

        const json = qfil.getJsonFromDataFile('showcases/showcaseEditXmlFile.xml');
        const xmlResources = json.resources.res;

        const resources = [];
        for (const item of xmlResources) {
            console.log('oki');
            resources.push({
                key: item._attributes.key
            });
        }
        console.log(resources);

        this.responseStatus = 'loaded';
        this.responseData = {
            json: json,
            resources: resources
        };
        this.sendResponse();
    }


}

module.exports = ControllerShowcaseEditXmlFile