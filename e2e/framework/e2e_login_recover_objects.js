'use strict';

var loginRecover = {

  //Locators
  passwordErrorPhoneNumbers: function () {
    return element.all(by.css('table.error-table'));
  },
  passwordErrorText: function () {
    return element(by.css('p[ng-show="passwordRecovery.questionsFailed"]'));
  },
  securityQuestion9Text: function () {
    return element.all(by.css('.security-question')).get(2);
  },
  securityQuestion9: function () {
    return element.all(by.id('question9'));
  },
  securityQuestion6Text: function () {
    return element.all(by.css('.security-question')).get(1);
  },
  securityQuestion10Text: function () {
    return element.all(by.css('.security-question')).get(0);
  },
  incorrectEmailFormat: function () {
    return element(by.css('p[ng-show="forgotUserNameValidity.email.$error.email"]'));
  },
  userName: function () {
    return element(by.id("userName"));
  },
  email: function () {
    return element(by.id("email"));
  },
  disabledFields: function () {
    return element.all(by.css('input[disabled="disabled"]'));
  },
  submitUsername: function () {
    return element(by.id("forgotUsernameSubmit"));
  },

  //Getters
  getPasswordErrorTextPhoneNumber: function () {
    return this.passwordErrorPhoneNumbers().get(2).getText();
  },
  getPasswordErrorText: function () {
    return this.passwordErrorText().getText();
  },
  getSecurityQuestion6Text: function () {
    return this.securityQuestion6Text().getText();
  },
  getSecurityQuestion9Text: function () {
    return this.securityQuestion9Text().getText();
  },
  getSecurityQuestion10Text: function () {
    return this.securityQuestion10Text().getText();
  },
  getIncorrectEmailFormat: function () {
    return this.incorrectEmailFormat().getText();
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
module.exports = loginRecover;
