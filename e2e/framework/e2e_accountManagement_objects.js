'use strict';

function AccountManagement() {

  var helper = require('../framework/e2e_helper_functions.js');
  var Helper = new helper.helper();

  //Locators
  this.elDepositEditButton = browser.element.all(by.buttonText('Edit')).get(0);
  this.elDepositAccount = browser.element.all(by.css('span[style="font-size: 13px"]')).get(0);
  this.elPaymentAccount = browser.element(by.css('p[ng-show="!editDefaultPAccount"]'));
  this.elFirstBankAccount = browser.element.all(by.cssContainingText('option', 'Fulton Bank -Main - 2794'));
  this.elSecondBankAccount = browser.element.all(by.cssContainingText('option', 'Bank Account 2 - 6789'));
  this.elSaveButton = browser.element.all(by.css('button.col-md-3.custom.btn-unstyle.save-edit')).get(0);
  this.elPaymentEdit = browser.element.all(by.buttonText('Edit')).get(1);
  this.elPaymentSave = browser.element.all(by.css('button.col-md-3.custom.btn-unstyle.save-edit')).get(1);
  this.elPaymentFirstBankAccount = browser.element.all(by.cssContainingText('option', '2794 - Fulton Bank -Main'));
  this.elPaymentSecondBankAccount = browser.element.all(by.cssContainingText('option', '6789 - Bank Account 2'));

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
  this.doDepositEdit = function () {
    browser.sleep(browser.params.shortDelay);
    this.elDepositEditButton.click();
  };
  this.doFirstBankAccount = function () {
    browser.sleep(browser.params.shortDelay);
    this.elFirstBankAccount.click();
  };
  this.doSecondBankAccount = function () {
    browser.sleep(browser.params.shortDelay);
    this.elSecondBankAccount.click();
  };
  this.doDepositSave = function () {
    browser.sleep(browser.params.longDelay);
    this.elSaveButton.click();
    browser.sleep(browser.params.shortDelay);
    browser.refresh();
  };
  this.doPaymentEdit = function () {
    browser.sleep(browser.params.shortDelay);
    this.elPaymentEdit.click();
  };
  this.doPaymentSave = function () {
    browser.sleep(browser.params.longDelay);
    this.elPaymentSave.click();
    browser.sleep(browser.params.shortDelay);
    browser.refresh();
  };
  this.doPaymentFirstBankAccount = function () {
    browser.sleep(browser.params.shortDelay);
    this.elPaymentFirstBankAccount.click();
  };
  this.doPaymentSecondBankAccount = function () {
    browser.sleep(browser.params.shortDelay);
    this.elPaymentSecondBankAccount.click();
  };
}
module.exports.accountManagement = AccountManagement;




