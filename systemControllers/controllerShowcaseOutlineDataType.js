"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qdat = require('../qtools/qdat');
const qstr = require('../qtools/qstr');
const ShowcaseBook = require('../systemItems/showcaseBook');
const markdown = require("markdown").markdown;

class ControllerShowcaseOutlineDataType extends Controller {
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
Input Text;p; $info = Note: The TAB key works in this box.
Output Text;p
        `;
		this.responseData = {};
		this.prepareFields();


		const date1 = qdat.getCurrentDate();
		const date2 = qdat.addDaysToDate(date1, 1);
		const date3 = qdat.addDaysToDate(date1, 2);

		this.responseData.fields.inputText.value =
			`- ${date1}
- note that any **yyyy-mm-dd** formatted date on a line by itself will be converted into a date header
	- the line after the date needs to be on the first outline level
- this is the first outline level, for instance
	- this is the second level
	- also second level
		- and third level
		- third level
- and this is the first level again with an image:##testCode
	- save the image as a **.png** file in the directly defined in \`system/config.js\` in the \`sourceImageAbsolutePath\` variable and it will automatically be saved in the appropriate file in \`public/systemImages\`
- ${date2}
- above is a new date section
- here are some notes (notice they are beige)
	---------------------------
	sdkjfskdfjskfsdfj
	sfkjsdfkjsdfksjdkfj
	--------------------------
- here is some code (notice they are grey):
	-------------------------------
	return {
		functionName: functionName,
		regexInfos: [regex.toString(), regexTemplate],
		text: text,
		parsedText: parsedText
	};
	-------------------------------
- ${date3}
- Notice also that all simple **Markdown** *works in outline mode as well*. 
	- You can insert bits of code like this: \`const i = 21; \`
	- And of course you can include links to websites like [Google](http://google.com).
	- And if you include a URL like this this (http://google.com), it will automatically be converted into a hyperlink.
- Special formatting also works: 	
	- You can also tell users to press the [[Save]] button.
	- Here is how you <H|highlight text|H> if you need to.
	- And this is an example of lowlighting, i.e. secondary info text that you see is there but have to look closer to read it
		- \`index.html\` <L|- the file that the browser loads first|L>
		- \`main.js\` <L|- the file that contains all the JavaScript code|L>
		- \`css.js\` <L|- the file that contains the stylesheet formatting|L>
	- And you can also embed videos by simply adding the YouTube code at the end of the line, like this:@@J0Aq44Pze-w
	- and you can use as many levels of outline as you need
- Here are some parsing possibilities if you use the outline to e.g. **keep track of tasks you are working on**:
	- This shows that you have something to do:
		- )) create another text report
		- )) convert all **jpg** files to **png**
	- This shows that you are working on something:
		- .. finishing the index.html page
	- And this shows that you are waiting on something:
		- ,, waiting for new specifications to be prepared
	- Of course the far-reaching idea here is that you can parse all items for these codes and collect all items you are currently working on, waiting on and doing, e.g. to list on one overview page.
- MORE_INFORMATION
- Here you can see that any text you write on the first level that is in **all caps** and has **spaces at underlines**, will be parsed as a header.
	- Note that the line after it has to be on the first level again.
`;
		this.sendResponse();
	}

	action_processForm() {
		const isValid = this.validateForm();
		if (isValid) {

			const outlineText = this.requestData.fields.inputText.value;
			const html = qstr.parseOutline(outlineText, 'showcaseOutlineDataType', { highlightedDateLines: true, highlightedDateLinesStart: '' });
			this.requestData.fields.outputText.value = html;


			//issue.htmlBody = 

			this.sendResponse();
		}
	}

}

module.exports = ControllerShowcaseOutlineDataType