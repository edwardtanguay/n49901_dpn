"use strict"
const Controller = require('./controller');
const DpDataLoader = require('../systemClasses/dpDataLoader');
const qsys = require('../qtools/qsys');
const qdev = require('../qtools/qdev');
const qstr = require('../qtools/qstr');
const qmat = require('../qtools/qmat');
const Users = require('../systemItems/user');
const dpod = require('../system/dpod');

class ControllerManageUser extends Controller {
    constructor(request, response) {
        super(request, response);
    }

    action_loadPageData() {
        const command = this.requestData.command;
        const id = this.requestData.id;

        this.responseData = {};
        this.responseStatus = 'loaded';
        this.formTypeDefinitionFieldBlock = `
Login
Password;pw
First Name
Last Name
Email
Access Groups  
`;

        this.prepareFields();
        if (qstr.isInList(command, 'edit, copy')) {
            const that = this;
            dpod.fetchItem(`user where id = ${id}`, function (item) {
                if (item == null) {
                    that.formStatus = 'error';
                    that.formMessage = `Item not found.`;
                } else {
that.responseData.fields.login.value = item.login || "";
that.responseData.fields.password.value = item.password || "";
that.responseData.fields.firstName.value = item.firstName || "";
that.responseData.fields.lastName.value = item.lastName || "";
that.responseData.fields.email.value = item.email || "";
that.responseData.fields.accessGroups.value = item.accessGroups || "";                   
                }
                that.sendResponse();
            });
        } else {
            this.sendResponse();
        }
    }

    action_processForm() {
        const isValid = this.validateForm();
        if (isValid) {
            const systemCommand = this.requestData.command;
            const id = this.requestData.id;

const login = this.getFieldValue('login');
const password = this.getFieldValue('password');
const firstName = this.getFieldValue('firstName');
const lastName = this.getFieldValue('lastName');
const email = this.getFieldValue('email');
const accessGroups = this.getFieldValue('accessGroups');

            const user = new Users();
            if (systemCommand == 'edit') {
                user.id = id;
            }

user.login = login;
user.password = password;
user.firstName = firstName;
user.lastName = lastName;
user.email = email;
user.accessGroups = accessGroups;            

            user.save();

            this.formStatus = ``;
            this.formMessage = ``;

            this.sendResponse();
        }
    }
}

module.exports = ControllerManageUser