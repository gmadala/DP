'use strict';

function AccountManagement() {

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
  this.elAddBankAccount = browser.element(by.buttonText("Add Account"));
  this.elCancelAddAccount = browser.element(by.css("button.btn-cta.cta-secondary"));
  this.elBankName = browser.element(by.id("bankName"));
  this.elAccountNumber = browser.element(by.id("accountNumber"));
  this.elConfirmAccountNumber = browser.element(by.id("confirmAccountNumber"));
  this.elRoutingNumber = browser.element(by.id("routingNumber"));
  this.elCity = browser.element(by.id("addressCity"));
  this.elState = browser.element(by.id("addressState"));
  this.elSubmitBankAccount = browser.element(by.id("submitProceed"));
  this.elStep1AddAccountTitle = browser.element(by.css("h4.add-account.step-two"));
  this.elStep2AddAccountTitle = browser.element.all(by.css("h4.add-account")).get(0);
  this.elTermsAddAccount = browser.element(by.css("label.checkbox-img.small"));

  //Getters
  this.getDepositAccount = function () {
    browser.sleep(browser.params.shortDelay);
    return this.elDepositAccount.getText();
  };
  this.getPaymentAccount = function () {
    browser.sleep(browser.params.shortDelay);
    return this.elPaymentAccount.getText();
  };
  this.getTextStep1AddAccountTitle = function () {
    browser.sleep(browser.params.shortDelay);
    return this.elStep1AddAccountTitle.getText();
  };
  this.getTextStep2AddAccountTitle = function () {
    browser.sleep(browser.params.shortDelay);
    return this.elStep2AddAccountTitle.getText();
  };

  //Doers
  this.doDepositEdit = function () {
    browser.sleep(browser.params.shortDelay);
    this.elDepositEditButton.click();
  };
  this.doFirstBankAccount = function () {
    browser.sleep(browser.params.shortDelay);
    this.elFirstBankAccount.click();
    browser.sleep(browser.params.longDelay);
  };
  this.doSecondBankAccount = function () {
    browser.sleep(browser.params.shortDelay);
    this.elSecondBankAccount.click();
    browser.sleep(browser.params.longDelay);
  };
  this.doDepositSave = function () {
    browser.sleep(browser.params.longDelay);
    this.elSaveButton.click();
    browser.sleep(browser.params.shortDelay);
    browser.refresh();
    browser.sleep(browser.params.longDelay);
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
    browser.sleep(browser.params.longDelay);
  };
  this.doPaymentFirstBankAccount = function () {
    browser.sleep(browser.params.shortDelay);
    this.elPaymentFirstBankAccount.click();
    browser.sleep(browser.params.longDelay);
  };
  this.doPaymentSecondBankAccount = function () {
    browser.sleep(browser.params.shortDelay);
    this.elPaymentSecondBankAccount.click();
    browser.sleep(browser.params.longDelay);
  };
  this.doAddAccount = function () {
    browser.sleep(browser.params.shortDelay);
    this.elAddBankAccount.click();
  };
  this.doCancelAddAccount = function () {
    browser.sleep(browser.params.shortDelay);
    this.elCancelAddAccount.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doSubmitBankAccount = function () {
    browser.sleep(browser.params.shortDelay);
    this.elSubmitBankAccount.click();
    browser.sleep(browser.params.shortDelay);
  };
  this.doTermsAddAccount = function () {
    browser.sleep(browser.params.shortDelay);
    this.elTermsAddAccount.click();
    browser.sleep(browser.params.shortDelay);
  };

  //Setters
  this.setBankDetails = function () {
    this.elBankName.sendKeys('Automation Bank');
    browser.sleep(browser.params.shortDelay);
    this.elAccountNumber.sendKeys('1111');
    browser.sleep(browser.params.shortDelay);
    this.elConfirmAccountNumber.sendKeys('1111');
    browser.sleep(browser.params.shortDelay);
    this.elRoutingNumber.sendKeys('123456789');
    browser.sleep(browser.params.shortDelay);
    this.elCity.sendKeys('Indy');
    browser.sleep(browser.params.shortDelay);
    this.elState.sendKeys('Indiana');
    browser.sleep(browser.params.shortDelay);
  };

}
module.exports.accountManagement = AccountManagement;




