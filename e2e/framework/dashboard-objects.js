'use strict';

var delay = 200;
var dashboard = {
  receiptsLink: function () {

    return element(by.css('a[ng-href="#/receipts"]'));

  },
  resourcesLink: function () {

    return element(by.css('a[ng-href="#/documents"]'));

  },

  requestCreditIncrease: function () {

    return element(by.id('requestCreditButton'));

  },

  //Locator End

  //Clicking
  clickResources: function () {

    this.resourcesLink().click();
    browser.sleep(delay);

  },
  clickReceiptsLink: function () {

    this.receiptsLink().click();
    browser.sleep(delay);

  },
  clickRequestCreditIncreaset: function () {

    this.requestCreditIncrease().click();
    browser.sleep(delay);

  },


  //Getting
  getPasswordErrorTextPhoneNumber: function () {
    return this.passwordErrorPhoneNumbers().get(2).getText();

  },



  //Sending
  enterQuestion9: function (param) {

    return this.securityQuestion9().clear().sendKeys(param);

  },


  //Count
  disabledCount: function () {

    return this.disabledFields().count();

  },
  //LAST ONE
  placeholder: function (index) {

    this._thumbnail(index).click();

  }
};

module.exports = dashboard;
