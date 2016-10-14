'use strict';

var loginObjects = require('../../framework/e2e_login_objects.js');
var helper = require('../../framework/e2e_helper_functions.js');
var login = require('../../framework/e2e_login.js');
var execSettings = require('../../framework/e2e_execSettings.js');
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
    browser.sleep(browser.params.longDelay);
    expect(browser.getCurrentUrl()).toEqual(execSettings.accountManagement());
    helper.popOver();
  });

  it("2. Bank account - Change bank deposit account same to payment account of Fulton Bank account", function () {
    //Set bank account to same as deposit then change and refresh and check bank account
    //Validate payment account
    accountManagement.doClickEdit();
    accountManagement.doFirstBankAccount();
    browser.sleep(browser.params.longDelay);
    accountManagement.doClickSave();
    browser.sleep(browser.params.shortDelay);
    browser.refresh();
    browser.sleep(browser.params.longDelay);
    expect(accountManagement.getDepositAccount()).toEqual("Fulton Bank -Main (...2794)");
  });

  it("3. Change to 2nd bank account Bank account 2", function () {
    accountManagement.doClickEdit();
    accountManagement.doSecondBankAccount();
    browser.sleep(browser.params.longDelay);
    accountManagement.doClickSave();
    //Validate and refresh
    expect(accountManagement.getDepositAccount()).toEqual("Bank Account 2 (...6789)");
    browser.refresh();
    browser.sleep(browser.params.longDelay);
    expect(accountManagement.getDepositAccount()).toEqual("Bank Account 2 (...6789)");
  });

  it("4. Bank Account - Logout", function () {
    login.logout();
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
  });

});
