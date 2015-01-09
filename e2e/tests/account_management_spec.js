/**
 * Created by gayathrimadala on 1/5/15.
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
//Account Management Content Testing WMT-87

  it('should check for the Business Email - No Editing', function(){
    expect(browser.getCurrentUrl()).toContain(accMgtPage.accountMgtUrl);
    expect(accMgtPage.businessEmailText.isDisplayed()).toBeTruthy();
    expect(accMgtPage.businessEmail.isDisplayed()).toBeTruthy();
    expect(accMgtPage.registrationEnabled.isPresent()).toBe(true);
  });

  it('should check for the Business Settings - Editing With Invalid Registration PIN', function(){

    var invalidRegPIN = 'test';
    businessSettings();
    accMgtPage.doEnhancedRegistrationPIN(invalidRegPIN);
    accMgtPage.goSaveSettings();
    expect(accMgtPage.enhancedRegPINError.isDisplayed()).toBeTruthy();
  });

  it('should check for the Business Settings - Editing With Valid Registration PIN', function(){
    var validRegPIN = '1234';
    businessSettings();
    accMgtPage.doEnhancedRegistrationPIN(validRegPIN);
    accMgtPage.goSaveSettings();
    expect(accMgtPage.enhancedRegPINError.isDisplayed()).not.toBeTruthy();
  });

  var businessSettings = function(){
    expect(browser.getCurrentUrl()).toContain(accMgtPage.accountMgtUrl);
    expect(accMgtPage.editSettings.isDisplayed()).toBeTruthy();
    expect(accMgtPage.goToEditSettings());
    expect(accMgtPage.businessEmailText.isDisplayed()).toBeTruthy();
    expect(accMgtPage.businessEmailInput.isDisplayed()).toBeTruthy();
    accMgtPage.goToEnhancedYes();
    expect(accMgtPage.registrationEnabledText.isDisplayed()).toBeTruthy();
    expect(accMgtPage.paragraphOne.isDisplayed()).toBeTruthy();
    expect(accMgtPage.paragraphTwo.isDisplayed()).toBeTruthy();
  };

  it('should check for the Financial Accounts - No Editing', function(){
    expect(browser.getCurrentUrl()).toContain(accMgtPage.accountMgtUrl);
    expect(accMgtPage.bankAccountText.isDisplayed()).toBeTruthy();
    expect(accMgtPage.availableCreditText.isDisplayed()).toBeTruthy();
    expect(accMgtPage.ReserveFundsText.isDisplayed()).toBeTruthy();
    expect(accMgtPage.lastPaymentText.isDisplayed()).toBeTruthy();
    expect(accMgtPage.lastPaymentDateText.isDisplayed()).toBeTruthy();
    expect(accMgtPage.unappliedFundsText.isDisplayed()).toBeTruthy();
    expect(accMgtPage.totalAvailableText.isDisplayed()).toBeTruthy();

    expect(accMgtPage.bankAccounts.isDisplayed()).toBeTruthy();
    expect(accMgtPage.availableCredit.isDisplayed()).toBeTruthy();
    expect(accMgtPage.reserveFunds.isDisplayed()).toBeTruthy();
    expect(accMgtPage.lastPayment.isDisplayed()).toBeTruthy();
    expect(accMgtPage.lastPaymentDate.isDisplayed()).toBeTruthy();
    expect(accMgtPage.unappliedFunds.isDisplayed()).toBeTruthy();
    expect(accMgtPage.totalAvailable.isDisplayed()).toBeTruthy();
  });

  it('should check for the Title Settings - No Editing', function(){
    expect(browser.getCurrentUrl()).toContain(accMgtPage.accountMgtUrl);
    expect(accMgtPage.defaultAddressText.isDisplayed()).toBeTruthy();
    expect(accMgtPage.additionalAddressText.isDisplayed()).toBeTruthy();
    expect(accMgtPage.addressOne.isDisplayed()).toBeTruthy();
    expect(accMgtPage.addressTwo.isDisplayed()).toBeTruthy();
    expect(accMgtPage.addressCity.isDisplayed()).toBeTruthy();
    expect(accMgtPage.addressState.isDisplayed()).toBeTruthy();
    expect(accMgtPage.addressZip.isDisplayed()).toBeTruthy();
  });

  it('should check for the Title Settings - Editing with Save Settings', function(){
    titleSettings();
    accMgtPage.goToButtonHelp();
    accMgtPage.goToSaveTitleSettings();
  });
  it('should check for the Title Settings - Editing with Cancel', function(){
    titleSettings();
    accMgtPage.goToButtonHelp();
    accMgtPage.goToCancelTitleSettings();
  });

  var titleSettings = function()  {
    expect(browser.getCurrentUrl()).toContain(accMgtPage.accountMgtUrl);
    expect(accMgtPage.defaultAddressText.isDisplayed()).toBeTruthy();
    expect(accMgtPage.additionalAddressText.isDisplayed()).not.toBe(true);
    expect(accMgtPage.buttonHelp.isDisplayed()).toBeTruthy();
    accMgtPage.goToEditTitleSettings();

    expect(accMgtPage.defaultAddress.isDisplayed()).toBeTruthy();
    var addressLocation = '380 NEVADA SW / HURON SD';
    expect(accMgtPage.defaultAddress.isDisplayed()).toBeTruthy();
    expect(accMgtPage.getAddressLocation()).not.toEqual(addressLocation);
    accMgtPage.setAddressLocation(addressLocation);
    expect(accMgtPage.getAddressLocation()).toEqual(addressLocation);

    expect(accMgtPage.addressOne.isDisplayed()).toBeTruthy();
    expect(accMgtPage.addressTwo.isDisplayed()).toBeTruthy();
    expect(accMgtPage.addressCity.isDisplayed()).toBeTruthy();
    expect(accMgtPage.addressState.isDisplayed()).toBeTruthy();
    expect(accMgtPage.addressZip.isDisplayed()).toBeTruthy();
  };

});
