"use strict"
const qstr = require('../qtools/qstr');
const qfil = require('../qtools/qfil');
const qdev = require('../qtools/qdev');
const fs = require('fs');
const config = require('../system/config');
const system = require('../system/system');

class SmartEntityType {

    constructor(entityTypeDefinitionBlock) {
        this.entityTypeDefinitionBlock = entityTypeDefinitionBlock;
        this.lines = qstr.convertStringBlockToLines(this.entityTypeDefinitionBlock);
        this.dataTypes = [];
    }

    parse() {
        for (const line of this.lines) {
            if (!qstr.isEmpty(line)) {
                if (line.startsWith(this.entityIdentifier)) {
                    this.recordIdentifierLine(line);
                } else {
                    const dataType = system.instantiateDataType(line);
                    this.dataTypes.push(dataType);
                }
            }
        }
    }

    recordIdentifierLine(line) {
        //for itemTypes
        // ** Showcase Test Items
        // **Showcase Test Items
        //for formTypes:
        // ## Request Information
        // ##Request Information
        const rawText = qstr.chopLeft(line, this.entityIdentifier);
        this.title = rawText.trim(); // Showcase Test Items

        this.idCode = qstr.forceCamelNotation(this.title); // showcaseTestItems
        this.singularIdCode = qstr.forceSingular(this.idCode); // showcaseTestItem

        this.singularCamelNotation = this.singularIdCode; // showcaseTestItem
        this.singularPascalNotation = qstr.forcePascalNotation(this.singularIdCode); // ShowcaseTestItem
        this.singularTextNotation = qstr.forceTextNotation(this.singularIdCode); // showcase test item
        this.singularTitleNotation = qstr.forceSingular(this.title); // Showcase Test Item

        this.pluralCamelNotation = this.idCode; // showcaseTestItems
        this.pluralPascalNotation = qstr.forcePascalNotation(this.idCode); // ShowcaseTestItems
        this.pluralTextNotation = qstr.forceTextNotation(this.idCode); // showcase test items
        this.pluralTitleNotation = this.title; // Showcase Test Items


        //this.singularCamelNotation
        //this.pluralNotation = this.idCode;
    }

    getHtml() {
        let r = '';
        r += `<div><b>title:</b> <code>${this.title}</code></div>`;
        r += `<div><b>idCode:</b> <code>${this.idCode}</code></div>`;
        for (const dataType of this.dataTypes) {
            r += dataType.getHtml();
        }
        return r;
    }

    getFields() {
        const ro = {};
        for (const dataType of this.dataTypes) {
            ro[dataType.idCode] = dataType.getEntityFieldObject();
        }
        return ro;
    }

    getFieldsAsCodeText() {
        let r = '';
        for (const dataType of this.dataTypes) {
            r += dataType.getFieldCodeText();
        }
        return r;
    }

    getFieldCodeForEmptyObject() {
        const ra = []
        for (const dataType of this.dataTypes) {
            ra.push(dataType.getFieldCodeForEmptyObject());
        }
        return ra.join(',' + qstr.NEW_LINE());
    }

    getCodeBlockDefineLocalVariables() {
        const ra = []
        for (const dataType of this.dataTypes) {
            ra.push(qstr.tabs(3) + dataType.getCodeBlockDefineLocalVariableLine());
        }
        return ra.join(qstr.NEW_LINE());
    }

    getCodeBlockVariableValueLine() {
        let r = '';
        if (this.dataTypes.length == 0) {
            r += 'Submit button pressed.';
        } else {
            r += 'Data received: <ul>';
            for (const dataType of this.dataTypes) {
                r += dataType.getCodeBlockVariableValuePart();
            }
            r += '</ul>';
        }
        return r;
    }

    getFieldDecorationCodeBlock() {
        const ra = []
        for (const dataType of this.dataTypes) {
            ra.push(qstr.tabs(3) + dataType.getFieldDecorationCodeBlockForController());
        }
        return ra.join(qstr.NEW_LINE());
    }

    getJavaScriptExtendedCodeBlock() {
        const ra = []
        for (const dataType of this.dataTypes) {
            ra.push(qstr.tabs(1) + dataType.getJavaScriptExtendedCodeBlock());
        }
        return ra.join(qstr.NEW_LINE());
    }
}

module.exports = SmartEntityType