'use strict';

var loginObjects = require('../../framework/e2e_login_objects.js');
var helper = require('../../framework/e2e_helper_functions.js');
var login = require('../../framework/e2e_login.js');
var modalObjects = require('../../framework/e2e_modal_objects.js');
var dashboard = require('../../framework/e2e_dashboard_objects.js');
var creditIncrease = require('../../framework/e2e_credit_increase_requ_objects.js');
var receipts = require('../../framework/e2e_receipts_objects.js');
var execSettings = require('../../framework/e2e_execSettings.js');
var increaseAmount = 1000;

//var Receipts = new receipts.ReceiptsObjects();
var dashboard = new dashboard.dashboardObjects();
var CredIncrease = new creditIncrease.creditIncrease();
var modalObjects = new modalObjects.modalObjects();
var loginObjects = new loginObjects.loginObjects();
var helper = new helper.helper();

describe('\n Dashboard Page', function () {

  beforeEach(function () {
    browser.sleep(browser.params.shortDelay);
    browser.ignoreSynchronization = true;
  });

  it("1. Dashboard - Login as 97421eh ", function () {
    helper.goToLogin();
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
    browser.sleep(browser.params.shortDelay);
    login.login2(browser.params.userName, browser.params.password);
    expect(browser.getCurrentUrl()).toEqual(execSettings.homePage());

  });

  it("2. Dashboard - Request a Temporary Credit Increase", function () {
    dashboard.doRequestCreditIncrease();
    //Select the Values in Request a Credit Increase POP UP window
    CredIncrease.doTemporaryIncrease();
    CredIncrease.enterIncreaseAmount(increaseAmount);
    CredIncrease.doConfirmRequest();
    //Check success modal
    expect(modalObjects.getTextHeader()).toEqual("Request a Credit Increase");
    expect(modalObjects.getTextBody()).toEqual("Your request has been submitted. Credit requests typically take 3-5 business days to process. You will be notified as soon as your request has been processed.");
    modalObjects.doOKBtn();
    expect(browser.getCurrentUrl()).toEqual(execSettings.homePage());
  });

  it("3. Dashboard - Request a Permanent Credit Increase", function () {
    dashboard.doRequestCreditIncrease();
    //Select the Values in Request a Credit Increase POP UP window
    CredIncrease.doPermanentIncrease();
    CredIncrease.enterIncreaseAmount(increaseAmount);
    CredIncrease.doConfirmRequest();
    //Check success modal
    expect(modalObjects.getTextHeader()).toEqual("Request a Credit Increase");
    expect(modalObjects.getTextBody()).toEqual("Your request has been submitted. Credit requests typically take 3-5 business days to process. You will be notified as soon as your request has been processed.");
    modalObjects.doOKBtn();
    expect(browser.getCurrentUrl()).toEqual(execSettings.homePage());
  });

  it("4. Dashboard - Print a Receipt by Grouped VIN", function () {
    //Click Receipts link
    dashboard.doReceipts();
    browser.sleep(browser.params.mediumDelay);
    receipts.clickFirstReceipt();
    receipts.clickExportReceipts();
    // Receipts.doFirstReceipt();
    // Receipts.doExportReceipts();
    browser.sleep(browser.params.mediumDelay);
    browser.getAllWindowHandles().then(function (handles) {
      browser.switchTo().window(handles[1]).then(function () {
        expect(browser.getCurrentUrl()).toContain("https://test.nextgearcapital.com/MobileService/api/receipt/viewMultiple/receipts?");
      });
      browser.sleep(browser.params.mediumDelay);
      browser.close();
      browser.switchTo().window(handles[0]);
      browser.sleep(browser.params.mediumDelay);
    });
  });

  it("5. Dashboard - Logout", function () {
    login.logout();
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
  });
});
