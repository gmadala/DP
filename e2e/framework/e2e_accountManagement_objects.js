'use strict';


function AccountManagement() {

  var helper = require('../framework/e2e_helper_functions.js');
  var Helper = new helper.helper();


  //Locators
  this.editButton = browser.element.all(by.buttonText('Edit')).get(0);
  this.elDepositAccount = browser.element.all(by.css('span[style="font-size: 13px"]')).get(0);
  this.elPaymentAccount = browser.element(by.css('p[ng-show="!editDefaultPAccount"]'));
  this.elFirstBankAccount = browser.element.all(by.cssContainingText('option', 'Fulton Bank -Main - 2794'));
  this.elSecondBankAccount = browser.element.all(by.cssContainingText('option', 'Bank Account 2 - 6789'));
  this.elSaveButton= browser.element.all(by.css('.col-md-3.custom.btn-unstyle.save-edit')).get(0);


  //Getters
  this.getDepositAccount = function () {
    browser.sleep(browser.params.shortDelay);
    return this.elDepositAccount.getText();
  };
  this.getPaymentAccount = function () {
    browser.sleep(browser.params.shortDelay);
    return this.elPaymentAccount.getText();
  };

  //Doers
  this.doClickEdit = function () {
    browser.sleep(browser.params.shortDelay);
    this.editButton.click();
  };
  this.doFirstBankAccount = function () {
    browser.sleep(browser.params.shortDelay);
    this.elFirstBankAccount.click();
  };
  this.doSecondBankAccount = function () {
    browser.sleep(browser.params.shortDelay);
    this.elSecondBankAccount.click();
  };
  this.doClickSave = function () {
    browser.sleep(browser.params.longDelay);
    this.elSaveButton.click();
  };
}
module.exports.accountManagement = AccountManagement;




