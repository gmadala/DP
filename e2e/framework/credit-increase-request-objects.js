'use strict';
var creditIncrease = {
  permanentIncrease: function() {

    return element(by.id('isNotTemp'));

  },

  firstLineOfCredit: function() {

    return element.all(by.id('lineOfCredit0'));

  },
  temporaryIncrease: function() {

    return element(by.id('isTemp'));

  },
  increaseAmount: function() {

    return element(by.id('increaseAmt'));

  },
  requestButton: function() {

    return element(by.id('confirmRequestButton'));

  },
  //Locator End

  //Clicking
  clickPermanentIncrease: function() {
    browser.sleep(browser.params.shortDelay);
    this.permanentIncrease().click();


  },

  clickRequestButton: function() {

    this.requestButton().click();
    browser.sleep(browser.params.shortDelay);

  },
  //clickFirstLineOfCredit: function() {
  //
  //  this.firstLineOfCredit().click();
  //  browser.sleep(browser.params.shortDelay);
  //
  //},
  clickTemporaryIncrease: function() {
    browser.sleep(browser.params.shortDelay);
    this.temporaryIncrease().click();


  },

  //Getting
  getPasswordErrorTextPhoneNumber: function() {
    return this.passwordErrorPhoneNumbers().get(2).getText();

  },


  //Sending
  enterIncreaseAmount: function(param) {
    browser.sleep(browser.params.shortDelay);
    this.increaseAmount().sendKeys(param);


  },


  //Count
  disabledCount: function() {

    return this.disabledFields().count();

  }
  //LAST ONE
  //placeholder: function(index) {
  //
  //  this.thumbnail(index).click();
  //
  //}
};

module.exports = creditIncrease;
