'use strict';

// var loginRecover = require('../../framework/login-recover-objects.js');
var login = require('../../framework/login.js');
var modalObjects = require('../../framework/e2e_modal_objects.js');
var dashboard = require('../../framework/dashboard-objects.js');
var creditIncrease = require('../../framework/e2e_credit_increase_requ_objects.js');
var receipts = require('../../framework/receipts-objects.js');
var execSettings = require('../../framework/e2e_execSettings.js');
var increaseAmount = 1000;
var CredIncrease = new creditIncrease.creditIncrease();

var modalObjects = new modalObjects.modalObjects();
describe("Log In Suite  \n ", function () {

  beforeEach(function () {
    browser.ignoreSynchronization = true;
  });

  it("1. Dealer - Login as 97421eh ", function () {
    browser.get(execSettings.loginPage());
    expect(browser.getCurrentUrl() === execSettings.loginPage());
    browser.sleep(browser.params.shortDelay);
    login.login2(browser.params.userName, browser.params.password);
    expect(browser.getCurrentUrl() === execSettings.homePage());

  });

  it("1. Dealer - Request a Temporary Credit Increase", function () {
    dashboard.clickRequestCreditIncrease();
    //Select the Values in Request a Credit Increase POP UP window
    CredIncrease.doTemporaryIncrease();
    CredIncrease.enterIncreaseAmount(increaseAmount);
    CredIncrease.doConfirmRequest();
    //Check success modal
    expect(modalObjects.getTextHeader()).toEqual("Request a Credit Increase");
    expect(modalObjects.getTextBody()).toEqual("Your request has been submitted. Credit requests typically take 3-5 business days to process. You will be notified as soon as your request has been processed.");
    modalObjects.doOKBtn();
    expect(browser.getCurrentUrl() === execSettings.homePage());
  });
  it("2. Dealer - Request a Permanent Credit Increase", function () {
    dashboard.clickRequestCreditIncrease();
    //Select the Values in Request a Credit Increase POP UP window
    CredIncrease.doPermanentIncrease();
    CredIncrease.enterIncreaseAmount(increaseAmount);
    CredIncrease.doConfirmRequest();
    //Check success modal
    expect(modalObjects.getTextHeader()).toEqual("Request a Credit Increase");
    expect(modalObjects.getTextBody()).toEqual("Your request has been submitted. Credit requests typically take 3-5 business days to process. You will be notified as soon as your request has been processed.");
    modalObjects.doOKBtn();
    expect(browser.getCurrentUrl() === execSettings.homePage());
  });
  it("3. As a dealer I want to print a receipt by grouped VIN", function () {
    //Click Credit increase
    dashboard.clickReceiptsLink();
    browser.sleep(browser.params.mediumDelay);
    receipts.clickFirstReceipt();
    receipts.clickExportReceipts();
    browser.sleep(browser.params.mediumDelay);
    browser.getAllWindowHandles().then(function (handles) {
      browser.switchTo().window(handles[1]).then(function () {
        expect(browser.getCurrentUrl()).toContain("https://test.nextgearcapital.com/MobileService/api/receipt/viewMultiple/receipts?");
      });
    });
  });


});
