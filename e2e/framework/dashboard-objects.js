'use strict';
/**
 * @class login_objects
 * @author Balanithiya Krishnamoorthy
 * @description Page objects for Dashboard page elements
 * */

//function DashboardObjects() {











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
    browser.sleep(browser.sleep(browser.params.longDelay));
    this.resourcesLink().click();


  },
  clickReceiptsLink: function () {
    browser.sleep(browser.sleep(browser.params.longDelay));
    this.receiptsLink().click();


  },
  clickRequestCreditIncrease: function () {
    browser.sleep(browser.sleep(browser.params.longDelay));
    this.requestCreditIncrease().click();


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
  //module.exports.dashbardObjects = DashboardObjects;
//module.exports = dashboard;
