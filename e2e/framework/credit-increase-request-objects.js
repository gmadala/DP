'use strict';

function CreditIncrease() {

  //Locators
  this.elPermanentIncrease = element(by.id('isNotTemp'));
  this.elFirstLineOfCredit = element(by.id('lineOfCredit0'));
  //this.elFirstLineOfCredit = element(by.css('div.input#lineOfCredit0.ng-pristine.ng-invalid.ng-invalid-required.ng-touched'));
  this.elTemporaryIncrease = element(by.id('isTemp'));
  this.elIncreaseAmount = element(by.id('increaseAmt'));
  this.elConfirmRequest = element(by.id('confirmRequestButton'));
  this.elCancelRequest = element(by.id('cancelRequestButton'));
  this.elCloseWindow = element(by.css('div.button.btn-cta.cta-secondary'));

  //Doers
  this.doPermanentIncrease = function () {
    this.elPermanentIncrease.click();
    browser.sleep(500);
  };
  this.doTemporaryIncrease = function () {
    this.elTemporaryIncrease.click();
    browser.sleep(500);
  };
  this.doConfirmRequest = function () {
    this.elConfirmRequest.click();
    browser.sleep(500);
  };
  this.doLineOfCredit = function () {
    this.elFirstLineOfCredit.click();
    browser.sleep(500);
  };
  this.doCloseWindow = function () {
    this.elCloseWindow.click();
    browser.sleep(500);
  };

  //Setters
  this.enterIncreaseAmount = function (param) {
    this.elIncreaseAmount.sendKeys(param);
  };
}

module.exports.creditIncrease = CreditIncrease;
