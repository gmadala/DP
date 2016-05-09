'use strict';

// var longDelay = 1000;
var delay = 500;
var resourcesObjects = {

  //Locators
  ratesAndFees: function () {

    return element(by.linkText('Rates and Fees'));

  },

  welcomePacket: function () {

    return element(by.linkText('Welcome Packet'));

  },
  dealerFudingChecklist: function () {

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
  //End of locators. Locators need to go before this
  //Click
  clickWelcomePacket: function () {
    browser.sleep(delay);
    this.welcomePacket().click();
  },
  clickRatesAndFees: function () {
    browser.sleep(delay);
    this.ratesAndFees().click();
  },
  clickDealerFunding: function () {
    browser.sleep(delay);
    this.dealerFudingChecklist().click();
  },
  clickTitleManagement: function () {
    browser.sleep(delay);
    this.titleManagement().click();
  },

  //Functions can go below

  checkNewTab: function (url) {
    browser.sleep(delay);
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
