/**
 * Created by gayathrimadala on 1/5/15.
 */

'use strict';

var AccountManagementPageObject = function () {
};

AccountManagementPageObject.prototype = Object.create({}, {


  // Locators
  accountMgtUrl: {
    value: '#/account_management'
  },

  requestCreditIncrease: {
    get: function () {
      return browser.element(by.cssContainingText('a', 'Request a Credit Increase'));
    }
  },

  creditExtend: {
    get: function() {
      return browser.element(by.id('lineOfCredit'));
    }
  },

  isNotTemporary:{
    get: function(){
      return browser.element(by.id('isTemp'));
    }
  },

  selectAmount:{
    get: function(){
      return browser.element(by.model('selector.amount'));
    }
  },

  GOFinancial: {
    get: function () {
      return browser.element(by.cssContainingText('a','Login to GO Financial'));
    }
  },

  cancelRequest: {
    get: function(){
      return browser.element(by.cssContainingText('button', 'Cancel Request'));
    }
  },

  confirmRequest: {
    get: function(){
      return browser.element(by.cssContainingText('button', 'Confirm Request'));
    }
  },

  //Setters
  setSelectAmount: {
    value: function(){
      this.selectAmount.sendKeys('100');
      browser.waitForAngular();
    }
  },

  //Doers
  doSelectAmount: {
    value: function(){
      this.setSelectAmount();
      browser.waitForAngular();
    }
  },

  goTorequestCreditIncrease: {
    value: function () {
      this.requestCreditIncrease.click();
      browser.waitForAngular();
    }
  },

  goToGOFinancial: {
    value: function () {
      this.GOFinancial.click();
      browser.waitForAngular();
    }
  },

  goToCreditExtend: {
    value: function () {
      this.creditExtend.click();
      browser.waitForAngular();
    }
  },

  goToIsNotTemporary: {
    value: function(){
      browser.driver.actions().click(this.isNotTemporary).perform();
    }
  },

  goToCancelRequest: {
    value: function(){
      this.cancelRequest.click();
      browser.waitForAngular();
    }
  },

  goToConfirmRequest: {
    value: function(){
      this.confirmRequest.click();
      browser.waitForAngular();
    }
  }

});
module.exports = AccountManagementPageObject;
