"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const ShowcaseBook = require('../systemItems/showcaseBook');

class ControllerAddFieldToItemType extends Controller {
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
        this.formTypeDefinitionFieldBlock = `
*Item Type Id Code;$example=regionalCustomers
*New Field Label
        `;
        this.responseData = {};

        this.prepareFields();
        this.responseData.fields.newFieldLabel.example = 'Notes;markdown';
        this.responseData.fields.newFieldLabel.label = 'Field Label with optional data type';
        this.sendResponse();
    }

    action_processForm() {
        const isValid = this.validateForm();
        if (isValid) {

            const itemTypeIdCode = this.getFieldValue('itemTypeIdCode');
            const fieldDefinitionLine = this.getFieldValue('newFieldLabel');
            const parts = qstr.breakIntoParts(fieldDefinitionLine, ';');
            const fieldLabel = qstr.getSmartPart(parts, 0);
            const dataTypeIdCode = qstr.getSmartPart(parts, 1);

            this.responseData.infoHtml = this.buildInfoHtml(itemTypeIdCode, fieldLabel, dataTypeIdCode, fieldDefinitionLine)

            this.sendResponse();

        }
    }

    buildInfoHtml(itemTypeIdCode, fieldLabel, dataTypeIdCode, fieldDefinitionLine) {
        let r = '';

        const singularItemTypeIdCode = qstr.forceSingular(itemTypeIdCode);
        const pluralItemTypeLabel = qstr.forceTitleNotation(itemTypeIdCode);
        const singularItemTypeLabel = qstr.forceSingular(pluralItemTypeLabel);
        const fieldIdCode = qstr.forceCamelNotation(fieldLabel);

        r += `<h5>Execute the following steps:</h5>
        
        <div class="stepInfo">1. In the file <code>systemItems/${singularItemTypeIdCode}.js</code>, add these two lines:</div>
        <input class="form-control codeLine" value="item.${fieldIdCode} = record['${fieldIdCode}'];"/>
        <input class="form-control codeLine" value="item.${fieldIdCode} = objectRecord.${fieldIdCode};"/>
        
        <div class="stepInfo">2. In the file <code>systemItems/${itemTypeIdCode}.js</code>, add this line:</div>
        <input class="form-control codeLine" value="${fieldDefinitionLine}"/>
        
        <div class="stepInfo">3. Add field <code>${fieldIdCode}</code> to database, above the <code>systemWhenCreated</code> field:</div>
        <img src="systemImages/addFieldToItemType_fieldInDatabase.png"/>
        
        <div class="stepInfo">4. Execute this SQL statement in the database to set the values of the new field from NULL to empty:</div>
        <input class="form-control codeLine" value="UPDATE ${itemTypeIdCode} SET ${fieldIdCode} = '' WHERE 1=1"/>
        
        <div class="stepInfo">5. Delete the <b>Manage ${singularItemTypeLabel}</b> page:</div>
        <ul>
            <li>go to <a href="deletePage" target="_blank">Delete Page</a></li>
            <li>Enter: <input class="form-control" value="Manage ${singularItemTypeLabel}"/></li>
        </ul>
        
        <div class="stepInfo">6. Delete the <b>Manage ${pluralItemTypeLabel}</b> page:</div>
        <ul>
            <li>go to <a href="deletePage" target="_blank">Delete Page</a></li>
            <li>Enter: <input class="form-control" value="Manage ${pluralItemTypeLabel}"/></li>
        </ul>
        
        <div class="stepInfo">7. Recreate the <b>Manage ${singularItemTypeLabel}</b> page:</div>
        <ul>
            <li>go to <a href="createPage" target="_blank">Create Page</a></li>
            <li>select <b>Manage Item</b></li>
            <li>Title: <input class="form-control" value="Manage ${singularItemTypeLabel}"/></li>
            <li>Item Type Id Code: <input class="form-control" value="${itemTypeIdCode}"/></li>
        </ul>
            
        <div class="stepInfo">8. Recreate the <b>Manage ${pluralItemTypeLabel}</b> page:</div>
        <ul>
            <li>go to <a href="createPage" target="_blank">Create Page</a></li>
            <li>select <b>Manage Items</b></li>
            <li>Title: <input class="form-control" value="Manage ${pluralItemTypeLabel}"/></li>
            <li>Item Type Id Code: <input class="form-control" value="${itemTypeIdCode}"/></li>
        </ul>
        

        
        `;

        return r;
    }

    action_parseMarkdown() {
        const markdown = this.getValue('markdown').trim();
        this.responseData.parsedText = qstr.parseMarkDown(markdown);
        this.sendResponse();
    }

}

module.exports = ControllerAddFieldToItemType