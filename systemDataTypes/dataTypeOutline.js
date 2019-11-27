"use strict"
const qstr = require('../qtools/qstr');
const DataTypeParagraph = require('./dataTypeParagraph');

class DataTypeOutline extends DataTypeParagraph {
	constructor(label, extras = "") {
		super(label, extras);
	}

	validate() {
		super.validate();
		return this.validationResponse();
	}

	getNiceValue(item, options = {}) {
		return '<div class="dataTypeOutline">' + qstr.parseOutline(this.getValue(item), item.itemTypeIdCode, options) + '</div>';
	}

	getTitleInfo() {
		return `outline`;
	}


	getHelpInfoHtml() {
		const ctrlText = '`CTRL-C`';
		return `<p>Syntax rules for creating outlines:</p>
    <ul>
        <li>type each line of outline with a preceding "- " and indent as needed</li>
        <li>You can write in *italics* or **bold** or type come code, e.g. ${ctrlText}.</li>
		<li>You can [search](http://google.com) here.</li>             
        <li>You can embed graphics (png) in your outline by refering to them at the end of a line like this. The .png graphic with that name (e.g. helpGraphic.png) has to be in the directory specified in config.sourceImageAbsolutePath().##helpGraphic</li>        
        <li>You can embed videos in your outline by refering to them with their YouTube code at the end of a line like this: a four-minute video of Guido van Rossum talking about how he created Python@@J0Aq44Pze-w</li>   		
    </ul>`;
	}

	getHelpInfoParseArea() {
		return `<div>
        <button class="btn-default btn btn-sm pull-left" :disabled="fields.${this.idCode}.waitForParsing"
            @click="parseHelpFieldText(fields.${this.idCode},'${this.idCode}', 'parseOutline')"
            v-show="fields.${this.idCode}.value">Update</button> <i v-show="fields.${this.idCode}.waitForParsing"
            class="pull-left fa fa-cog fa-spin checkSyntaxWaitIcon"></i>
        <div class="clear"></div>
        <div class="mainParsedTextArea"
            :class="{parsedTextArea: !fields.${this.idCode}.waitForParsing, parsedTextAreaWaiting: fields.${this.idCode}.waitForParsing}"
            v-show="fields.${this.idCode}.showParsedText && fields.${this.idCode}.value"
            v-html="fields.${this.idCode}.parsedText"></div>
    </div>`;
	}

	getFieldDecorationCodeBlockForController() {
		return `this.responseData.fields.${this.idCode}.info = \`Note that the TAB key can be used in this field to indent lines for the outline.\``;
	}

	getJavaScriptExtendedCodeBlock() {
		const backslash = '\\';
		return `    $(function () {
            $(document).delegate('#field_${this.idCode}', 'keydown', function (e) {
                var keyCode = e.keyCode || e.which;

                if (keyCode == 9) {
                    e.preventDefault();
                    var start = this.selectionStart;
                    var end = this.selectionEnd;

                    // set textarea value to: text before caret + tab + text after caret
                    $(this).val($(this).val().substring(0, start)
                        + "${backslash}t"
                        + $(this).val().substring(end));

                    // put caret at right position again
                    this.selectionStart = this.selectionEnd = start + 1;
                }
            });
        });
        `;
	}



	getHelpIconArea() {
		return `<span class="pull-right"><i class="fa fa-question-circle helpIcon"
                @click="toggleShowHelp(fields.${this.idCode}, '${this.idCode}', 'parseOutline')" title="Outline Help"></i></span>`;

	}

}

module.exports = DataTypeOutline;