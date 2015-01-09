/**
 * Created by gayathrimadala on 1/5/15.
 */
/**
 * Created by gayathrimadala on 12/29/14.
 */

'use strict';
var accMgtlObject = require('../framework/account_management_page_object.js');

var accMgtPage = new accMgtlObject();

describe('Account Management Page', function(){

  beforeEach(function(){
    browser.ignoreSynchronization = true;
    browser.get(accMgtPage.accountMgtUrl);
    browser.waitForAngular();
  });

  it('should check for the Request a Credit Increase - Cancel Request', function(){
    expect(browser.getCurrentUrl()).toContain(accMgtPage.accountMgtUrl);
    requestCreditIncrease();
    accMgtPage.goToCancelRequest();

  });
  it('should check for the Request a Credit Increase - Confirm Request', function(){
    expect(browser.getCurrentUrl()).toContain(accMgtPage.accountMgtUrl);
    requestCreditIncrease();
    accMgtPage.goToConfirmRequest();
  });

  it('should check for Login to GO Financial', function () {
    expect(browser.getCurrentUrl()).toContain(accMgtPage.accountMgtUrl);
    expect(accMgtPage.GOFinancial.isDisplayed()).toBeTruthy();

    browser.driver.getAllWindowHandles().then(function (handles) {
      expect(handles.length).toEqual(1);
    });
    expect(accMgtPage.GOFinancial).toBeDefined();
    accMgtPage.GOFinancial.then(function (goFinancialLink) {
      goFinancialLink.click();
    });

    browser.driver.getAllWindowHandles().then(function (handles) {
      expect(handles.length).toEqual(2);
      var firstHandle = handles[0];
      var secondHandle = handles[1];
      browser.switchTo().window(secondHandle).then(function () {
        browser.executeScript('return window.location.href').then(function (url) {
          expect(url).not.toContain(accMgtPage.accountMgtUrl);
          browser.driver.close().then(function () {
            browser.switchTo().window(firstHandle);
          });
        });
      });
    });
  });

  var requestCreditIncrease = function() {
    accMgtPage.goTorequestCreditIncrease();
    expect(accMgtPage.creditExtend.isDisplayed()).toBeTruthy();
    expect(accMgtPage.isNotTemporary.isDisplayed()).toBeTruthy();
    expect(accMgtPage.selectAmount.isDisplayed()).toBeTruthy();
    accMgtPage.goToCreditExtend();
    accMgtPage.goToIsNotTemporary();
    accMgtPage.doSelectAmount();
  };

});
