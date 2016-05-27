'use strict';


var resourcesObjects = {

  //Locators
  ratesAndFees: function () {

    return element(by.linkText('Rates and Fees'));

  },

  welcomePacket: function () {

    return element(by.linkText('Welcome Packet'));

  },
  dealerFundingChecklist: function () {

    return element(by.linkText('Dealer Funding Checklist'));

  },
  titleManagement: function () {

    return element(by.linkText('Title Management Frequently Asked Questions'));

  },
  instructionsBuyers: function () {

    return element(by.linkText('Instructions for Buyers'));

  },
  welcomeLetter: function () {

    return element(by.linkText('Welcome Letter'));

  },
  guidelines: function () {

    return element(by.linkText('Guidelines'));

  },
  informationSheet: function () {

    return element(by.linkText('Information Sheet'));

  },
  claimForm: function () {

    return element(by.linkText('Claim Form'));

  },
  iosApp: function () {

    return element(by.css('a[nxg-track="Dealer Resources - iOS Apps"]'));

  },
  androidApp: function () {

    return element(by.css('a[nxg-track="Dealer Resources - Android Apps"]'));

  },
  //End of locators. Locators need to go before this
  //Click
  clickAndroid: function () {
    browser.sleep(browser.params.shortDelay);
    this.androidApp().click();
  },
  clickIosApp: function () {
    browser.sleep(browser.params.shortDelay);
    this.iosApp().click();
  },
  clickWelcomePacket: function () {
    browser.sleep(browser.params.shortDelay);
    this.welcomePacket().click();
  },
  clickRatesAndFees: function () {
    browser.sleep(browser.params.shortDelay);
    this.ratesAndFees().click();
  },
  clickDealerFunding: function () {
    browser.sleep(browser.params.shortDelay);
    this.dealerFundingChecklist().click();
  },
  clickTitleManagement: function () {
    browser.sleep(browser.params.shortDelay);
    this.titleManagement().click();
  },
  clickInstructionsForBuyers: function () {
    browser.sleep(browser.params.shortDelay);
    this.instructionsBuyers().click();
  },
  clickWelcomeLetter: function () {
    browser.sleep(browser.params.shortDelay);
    this.welcomeLetter().click();
  },
  clickGuidelines: function () {
    browser.sleep(browser.params.shortDelay);
    this.guidelines().click();
  },
  clickInformationSheet: function () {
    browser.sleep(browser.params.shortDelay);
    this.informationSheet().click();
  },
  clickClaimForm: function () {
    browser.sleep(browser.params.shortDelay);
    this.claimForm().click();
  },

  //Functions can go below

  checkNewTab: function (url) {
    browser.sleep(browser.params.mediumDelay);
    browser.getAllWindowHandles().then(function (handles) {
      browser.switchTo().window(handles[1]).then(function () {
        expect(browser.getCurrentUrl()).toContain(url);
      });
    });
  },

  //LAST ONE
  clickOkButton: function () {

    return this.okButton().click();

  }
};


module.exports = resourcesObjects;
