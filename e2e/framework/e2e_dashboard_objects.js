'use strict';

function DashboardObjects() {

  var delay = 500;
  var longDelay = 5000;
  var longerDelay = 10000;

  //Locators
  this.elReceiptsLink = browser.element(by.css('a[ng-href="#/receipts"]'));
  this.elResourcesLink = browser.element(by.css('a[ng-href="#/documents"]'));
  this.elRequestCreditIncrease = browser.element(by.id('requestCreditButton'));

  //Doers
  this.doResources = function () {
    browser.sleep(browser.sleep(browser.params.longDelay));
    return this.elResourcesLink.click();
    browser.sleep(delay);
  };
  this.doReceipts = function () {
    browser.sleep(browser.sleep(browser.params.longDelay));
    return this.elReceiptsLink.click();
    browser.sleep(delay);
  };
  this.doRequestCreditIncrease = function () {
    browser.sleep(longDelay);
    this.elRequestCreditIncrease.click();
    browser.sleep(longerDelay);
  };

  //Getters
  this. getPasswordErrorTextPhoneNumber = function () {
    return this.passwordErrorPhoneNumbers().get(2).getText();
  };

  //Setters
  this.enterQuestion9 = function (param) {
    return this.securityQuestion9().clear().sendKeys(param);
  };

  //Count
  this.disabledCount = function () {
    return this.disabledFields().count();
  };
  //LAST ONE
  this.placeholder = function (index) {
    return  this._thumbnail(index).click();
  }

}
module.exports.dashboardObjects = DashboardObjects;
