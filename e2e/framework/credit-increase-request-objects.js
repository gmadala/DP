'use strict';

function CreditIncrease() {

  //Locators
  this.elPermanentIncrease = element(by.id('isNotTemp'));
  this.elFirstLineOfCredit = element.all(by.id('lineOfCredit0'));
  this.elTemporaryIncrease = element(by.id('isTemp'));
  this.elIncreaseAmount = element(by.id('increaseAmt'));
  this.elSubmitRequest = element(by.id('confirmRequestButton'));
  this.elCancelRequest = element(by.id('cancelRequestButton'));

  //Doers
  this.doPermanentIncrease = function () {
    this.elPermanentIncrease.click();
  };
  this.doTemporaryIncrease = function () {
    this.elTemporaryIncrease.click();
  };
  this.doSubmitRequest = function () {
    this.elSubmitRequest.click();
  };

  //Setters
  this.enterIncreaseAmount = function (param) {
    this.elIncreaseAmount.sendKeys(param);
  };
}

module.exports.creditIncrease = CreditIncrease;
