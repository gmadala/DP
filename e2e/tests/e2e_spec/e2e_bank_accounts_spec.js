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

  it("2. Bank Accounts - Change Deposit Account to Fulton Bank account", function () {
    //Set bank account to same as deposit then change and refresh and check bank account
    //Validate the existing Deposit Account
    expect(accountManagement.getDepositAccount()).toEqual("Bank Account 2 (...6789)");
    //Validate the existing Payment Account
    expect(accountManagement.getPaymentAccount()).toEqual("Fulton Bank -Main (...2794)");
    accountManagement.doDepositEdit();
    accountManagement.doFirstBankAccount();
    browser.sleep(browser.params.longDelay);
    accountManagement.doDepositSave();
    browser.sleep(browser.params.longDelay);
    expect(accountManagement.getDepositAccount()).toEqual("Fulton Bank -Main (...2794)");
    expect(accountManagement.getPaymentAccount()).toEqual("Fulton Bank -Main (...2794)");
  });

  it("3. Bank Accounts - Change Deposit Account to Bank account 2", function () {
    accountManagement.doDepositEdit();
    accountManagement.doSecondBankAccount();
    browser.sleep(browser.params.longDelay);
    accountManagement.doDepositSave();
    //Validate deposit and payment accounts
    browser.sleep(browser.params.longDelay);
    expect(accountManagement.getDepositAccount()).toEqual("Bank Account 2 (...6789)");
    expect(accountManagement.getPaymentAccount()).toEqual("Fulton Bank -Main (...2794)");
  });

  it("4. Bank Accounts - Change Payment Account Name to Bank account 2", function () {
    accountManagement.doPaymentEdit();
    accountManagement.doPaymentSecondBankAccount();
    browser.sleep(browser.params.longDelay);
    accountManagement.doPaymentSave();
    browser.sleep(browser.params.longDelay);
    expect(accountManagement.getPaymentAccount()).toEqual("Bank Account 2 (...6789)");
    expect(accountManagement.getDepositAccount()).toEqual("Bank Account 2 (...6789)");
  });
  it("5. Bank Accounts - Change Payment Account Name to Fulton Bank account", function () {
    accountManagement.doPaymentEdit();
    accountManagement.doPaymentFirstBankAccount();
    browser.sleep(browser.params.longDelay);
    accountManagement.doPaymentSave();
    browser.sleep(browser.params.longDelay);
    expect(accountManagement.getPaymentAccount()).toEqual("Fulton Bank -Main (...2794)");
    expect(accountManagement.getDepositAccount()).toEqual("Bank Account 2 (...6789)");
  });

  it("6. Bank Accounts - Logout", function () {
    login.logout();
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
  });

});
