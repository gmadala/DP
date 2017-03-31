'use strict';

var loginObjects = require('../../framework/e2e_login_objects.js');
var helper = require('../../framework/e2e_helper_functions.js');
var login = require('../../framework/e2e_login.js');
var accountManagement = require('../../framework/e2e_accountManagement_objects.js');

var loginObjects = new loginObjects.loginObjects();
var accountManagement = new accountManagement.accountManagement();
var helper = new helper.helper();

describe('\n Bank Account', function () {

    beforeEach(function () {
        browser.sleep(browser.params.shortDelay);
        browser.ignoreSynchronization = true;
        browser.driver.manage().window().maximize();
    });

    it("1. Bank Accounts - Login as 3boysmotors ", function () {
        helper.goToLogin();
        loginObjects.setLogin(browser.params.userNameBankAccount, browser.params.password);
        loginObjects.doLogin();
        helper.goToAccountManagement();
        expect(browser.getCurrentUrl()).toEqual(helper.accountManagementPage());
    });

    it("2. Bank Accounts - Change Deposit Bank Accounts", function () {
        accountManagement.doDepositEdit();
        accountManagement.doFirstDepositBankAccount();
        accountManagement.doDepositSave();
        expect(accountManagement.getDepositAccount()).toEqual("Fulton Bank -Main (...2461)");
        accountManagement.doDepositEdit();
        accountManagement.doSecondDepositBankAccount();
        accountManagement.doDepositSave();
        expect(accountManagement.getDepositAccount()).toEqual("Wells Fargo - 3712 (...3730)");
    });

    it("3. Bank Accounts - Change Payment Bank Accounts", function () {
        accountManagement.doPaymentEdit();
        accountManagement.doPaymentFirstBankAccount();
        accountManagement.doPaymentSave();
        expect(accountManagement.getPaymentAccount()).toEqual("Wells Fargo - 3712 (...3730)");
        accountManagement.doPaymentEdit();
        accountManagement.doPaymentSecondBankAccount();
        accountManagement.doPaymentSave();
        expect(accountManagement.getPaymentAccount()).toEqual("Fulton Bank -Main (...2461)");
        expect(accountManagement.getDepositAccount()).toEqual("Wells Fargo - 3712 (...3730)");
    });

    it("4. Bank Accounts - Validating Add Bank Account Functionality Before Hit the Submit Button", function () {
        expect(accountManagement.elAddBankAccount.isDisplayed()).toBe(true);
        accountManagement.doAddAccount();
        expect(accountManagement.getTextStep1AddAccountTitle()).toEqual("Step 1 of 2: Add Your Account");
        accountManagement.setBankDetails();
        accountManagement.doSubmitBankAccount();
        expect(accountManagement.getTextStep2AddAccountTitle()).toEqual("Step 2 of 2: Designated Account Change Request and Consent");
        accountManagement.doTermsAddAccount();
        expect(accountManagement.elCancelAddAccount.isDisplayed()).toBe(true);
        accountManagement.doCancelAddAccount();
    });

    it("5. Bank Accounts - Logout", function () {
        login.logout();
        expect(browser.getCurrentUrl()).toEqual(helper.loginPage());
    });

});
