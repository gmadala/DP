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

  GOFinancial: {
    get: function () {
      return browser.element(by.cssContainingText('a','Login to GO Financial'));
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
  }

});
module.exports = AccountManagementPageObject;
