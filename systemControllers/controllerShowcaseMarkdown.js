"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const ShowcaseBook = require('../systemItems/showcaseBook');

class ControllerShowcaseMarkdown extends Controller {
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
		this.responseData.fields.inputText.value =
			`# Header 1
## Header 2
### Header 3

---

You can write in *italics* or **bold** or type come code, e.g. \`CTRL-C\`.

You can [search](http://google.com) here.

---

Here we have some code:

    const qsys = require('../qtools/qsys');
    const qdev = require('../qtools/qdev');
    const qstr = require('../qtools/qstr');


---

Here is a general list:

- one
- two
- three

And here is a numbered list:

1. one
2. two
3. three

And a nested list:

1. You want to do these first:
	* one
	* two
		* the first part
		* And this is the second part which is a long, long, long, long, long, long, long, long, long, long, long, long, long, long, long, long, long, long, long, long text.
	* three
2. Then do these:
	* first one
	* second one
		* the first part
        * the second part
        
---

Force manual breaks with two spaces at end of each line:

This is a line  
And so is this one  
And this one too  
And so is this.  

---
And you can include images with the **relative path** like this: 

![](systemImages/showcases/markdown/blueSquare.png)`;
		this.sendResponse();
	}

	action_processForm() {
		const isValid = this.validateForm();
		if (isValid) {

			const markdownText = this.requestData.fields.inputText.value;
			const html = qstr.parseMarkDown(markdownText);
			this.requestData.fields.outputText.value = html;

			this.sendResponse();
		}
	}

}

module.exports = ControllerShowcaseMarkdown