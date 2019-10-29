"use strict"
const qstr = require('../qtools/qstr');
const DataTypeParagraph = require('./dataTypeParagraph');

class DataTypeMarkdown extends DataTypeParagraph {
    constructor(label, extras = "") {
        super(label, extras);
    }

    validate() {
        super.validate();
        return this.validationResponse();
    }

    getNiceValue(item) {
        return '<div class="dataTypeMarkdown">' + qstr.parseMarkDown(this.getValue(item)) + '</div>';
    }

    getTitleInfo() {
        return `markdown`;
    }

    getHelpInfoHtml() {
        const ctrlText = '`CTRL-C`';
        return `<p>Text entered in this field will be parsed as Markdown. You can use the following Markdown
        syntax:</p>
    <ul>
        <li>You can write in *italics* or **bold** or type come code, e.g. ${ctrlText}.</li>
        <li>You can [search](http://google.com) here.</li>
        <li># Header 1</li>
        <li>## Header 2</li>
        <li>### Header 3</li>
        <li><a href="showcaseMarkdown" target="_blank">more syntax examples and interactive Markdown editor</a>
        </li>
    </ul>`;
    }

    getHelpInfoParseArea() {
        return `<div>
        <button class="btn-default btn btn-sm pull-left" :disabled="fields.${this.idCode}.waitForParsing"
            @click="parseHelpFieldText(fields.${this.idCode},'${this.idCode}', 'parseMarkdown')"
            v-show="fields.${this.idCode}.value">Update</button> <i v-show="fields.${this.idCode}.waitForParsing"
            class="pull-left fa fa-cog fa-spin checkSyntaxWaitIcon"></i>
        <div class="clear"></div>
        <div class="mainParsedTextArea"
            :class="{parsedTextArea: !fields.${this.idCode}.waitForParsing, parsedTextAreaWaiting: fields.${this.idCode}.waitForParsing}"
            v-show="fields.${this.idCode}.showParsedText && fields.${this.idCode}.value"
            v-html="fields.${this.idCode}.parsedText"></div>
    </div>`;
    }

    getHelpIconArea() {
        return `<span class="pull-right"><i class="fa fa-question-circle helpIcon"
                @click="toggleShowHelp(fields.${this.idCode}, '${this.idCode}', 'parseMarkdown')" title="Markdown Help"></i></span>`;
    }
}
module.exports = DataTypeMarkdown;