'use strict';

// var loginRecover = require('../../framework/login-recover-objects.js');
var login = require('../../framework/login.js');
var modal = require('../../framework/modal-objects.js');
var dashboard = require('../../framework/dashboard-objects.js');
var creditIncrease = require('../../framework/credit-increase-request-objects.js');
var receipts = require('../../framework/receipts-objects.js');
var homepageUrl="https://test.nextgearcapital.com/test/#/login";
var tempIncrease= 1000;
describe("Log In Suite  \n ", function () {

  beforeEach(function () {
    browser.get(homepageUrl);
    browser.ignoreSynchronization = true;
    browser.sleep(browser.params.shortDelay);
    login.login2(browser.params.userName,browser.params.password);

  });

  it("1. As a dealer I want to request a temporary credit increase", function () {
    //Login and go to request credit increase
    dashboard.clickRequestCreditIncrease();
    //Select Credit line and click on temp
    //creditIncrease.clickFirstLineOfCredit();
    creditIncrease.clickTemporaryIncrease();
    creditIncrease.enterIncreaseAmount('1000');
    creditIncrease.clickRequestButton();
    //Check success modal
    expect(modal.header()).toEqual("Request a Credit Increase");
    expect(modal.body()).toEqual("Your request has been submitted. Credit requests typically take 3-5 business days to process. You will be notified as soon as your request has been processed.");
    modal.clickOkButton();
  });
  it("2. As a dealer I want to request a permanent credit increase", function () {
    //Click Credit increase
    dashboard.clickRequestCreditIncrease();
    //Select Credit line and click on temp
    //creditIncrease.clickFirstLineOfCredit();
    creditIncrease.clickPermanentIncrease();
    creditIncrease.enterIncreaseAmount(tempIncrease);
    creditIncrease.clickRequestButton();
    //Check success modal
    expect(modal.header()).toEqual("Request a Credit Increase");
    expect(modal.body()).toEqual("Your request has been submitted. Credit requests typically take 3-5 business days to process. You will be notified as soon as your request has been processed.");
    modal.clickOkButton();


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
