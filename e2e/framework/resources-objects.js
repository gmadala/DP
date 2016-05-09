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
  dealerFudingChecklis: function () {

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

  //Functions can go below


  //LAST ONE
  clickOkButton: function () {

    return this.okButton().click();

  }
};


module.exports = resourcesObjects;
