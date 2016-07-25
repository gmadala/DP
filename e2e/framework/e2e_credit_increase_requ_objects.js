'use strict';

function CreditIncrease() {

  //Locators
  this.elPermanentIncrease = element(by.id('isNotTemp'));
  this.elFirstLineOfCredit = element(by.id('lineOfCredit0'));
  this.elTemporaryIncrease = element(by.id('isTemp'));
  this.elIncreaseAmount = element(by.id('increaseAmt'));
  this.elConfirmRequest = element(by.id('confirmRequestButton'));
  this.elCancelRequest = element(by.id('cancelRequestButton'));
  this.elCloseWindow = element(by.css('div.button.btn-cta.cta-secondary'));

  //Doers
  this.doPermanentIncrease = function() {
    this.elPermanentIncrease.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doTemporaryIncrease = function() {
    this.elTemporaryIncrease.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doConfirmRequest = function() {
    this.elConfirmRequest.click();
    browser.sleep(browser.params.longDelay);
  };
  this.doLineOfCredit = function() {
    this.elFirstLineOfCredit.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doCloseWindow = function() {
    this.elCloseWindow.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doCancelRequest = function() {
    this.elCancelRequest.click();
    browser.sleep(browser.params.shortDelay);
  };

  //Setters
  this.enterIncreaseAmount = function(param) {
    this.elIncreaseAmount.sendKeys(param);
  };
}

module.exports.creditIncrease = CreditIncrease;
