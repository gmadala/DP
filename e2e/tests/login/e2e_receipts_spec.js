'use strict';

var loginObjects = require('../../framework/e2e_login_objects.js');
var helper = require('../../framework/e2e_helper_functions.js');
var login = require('../../framework/e2e_login.js');
var receipts = require('../../framework/e2e_receipts_objects.js');
var execSettings = require('../../framework/e2e_execSettings.js');

var loginObjects = new loginObjects.loginObjects();
var receipts = new receipts.receipts();
var helper = new helper.helper();

describe('\n Receipts Page', function () {

  beforeEach(function () {
    browser.sleep(browser.params.shortDelay);
    browser.ignoreSynchronization = true;
  });

  it("1. Receipts - Login as 97421eh ", function () {
    helper.goToLogin();
    loginObjects.doGoodLogin();
    helper.goToReceipts();
    browser.sleep(browser.params.delay);
    expect(browser.getCurrentUrl()).toEqual(execSettings.receiptsPage());
  });

  it("2. Receipts - Print a Receipt by Grouped VIN", function () {
    //Click First Receipt link
    receipts.doFirstReceipt();
    receipts.doExportReceipts();
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

  it("3. Receipts - Validating the labels and text boxes ", function () {
    expect(receipts.elReceiptsLabel.isDisplayed()).toBe(true);
    expect(receipts.getTestClearSearch()).toEqual('Clear Search');
  });

  it("4. Receipts - Receipts Search ", function () {
    receipts.setVIN();
    receipts.doFloorPlanSearch();
    expect(browser.getCurrentUrl()).toEqual(execSettings.receiptsPage());
    receipts.doPaymentMethod();
    expect(browser.getCurrentUrl()).toEqual(execSettings.receiptsPage());
    receipts.doDatesSearch();
    expect(browser.getCurrentUrl()).toEqual(execSettings.receiptsPage());
  });


  it("5. Receipts - Logout", function () {
    login.logout();
    expect(browser.getCurrentUrl()).toEqual(execSettings.loginPage());
  });
});
