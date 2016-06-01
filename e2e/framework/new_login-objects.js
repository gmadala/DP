'use strict';

function newLogin() {
  var userName = '53190md';
  var password = 'ngcpass!0';
  var delay = 200;
  var longDelay = 2000;

  this.elForgotUsernamePassword = browser.element(by.id("forgotUsernamePassword"));
  //this.elGetTextSignUpLogin = browser.element(by.id("signUpLogin"));
  this.elEmail = browser.element(by.id("email"));
  this.elSubmitUsername = browser.element(by.id("forgotUsernameSubmit"));
  this.elSignUpLogin =browser.element(by.id("signUpLogin"));


  //Doers
  this.doForgotUsernamePassword = function () {
    return this.elForgotUsernamePassword.click();
    browser.sleep(delay);
  };

  this.doUsernameSubmit = function () {
    return this.elSubmitUsername.click();
    browser.sleep(delay);
  };
  this.doSignUpLogin = function () {
    return this.elSignUpLogin.click();
    browser.sleep(delay);
  };

  //Getters
  this.getTextForgotUsernamePassword = function () {
    return this.elForgotUsernamePassword.getText();
  };

  this.getTextSignUpLogin = function () {
    // return this.elGetTextSignUpLogin.getText();
    return this.elSignUpLogin.getText();
  };

  this.getTextSubmitBtn = function () {
        return this.elSubmitUsername().getText();
  };


  //Setters
  this.setEmail = function (param) {
    browser.sleep(browser.params.shortDelay);
    this.elEmail.sendKeys(param);
  };

}


// var loginRecover = {
//
//   //Locators
//   //Password error phone numbers
//   passwordErrorPhoneNumbers: function () {
//
//     return element.all(by.css('table.error-table'));
//
//   },
//   //passwordErrorPhoneNumberText: function () {
//   //
//   //  return element(by.css('p[ng-show="passwordRecovery.questionsFailed"]'));
//   //
//   //},
//   passwordErrorText: function () {
//
//     return element(by.css('p[ng-show="passwordRecovery.questionsFailed"]'));
//
//   },
//
//   securityQuestion9Text: function () {
//
//     return element.all(by.css('.security-question')).get(2);
//
//   },
//   securityQuestion9: function () {
//
//     return element.all(by.id('question9'));
//
//   },
//   securityQuestion6Text: function () {
//
//     return element.all(by.css('.security-question')).get(1);
//
//   },
//   securityQuestion6: function () {
//
//     return element.all(by.id('question6'));
//
//   },
//   securityQuestion10Text: function () {
//
//     return element.all(by.css('.security-question')).get(0);
//
//   },
//   securityQuestion10: function () {
//
//     return element(by.id('question10'));
//
//   },
//   securityQuestion5: function () {
//
//     return element(by.id('question3'));
//
//   },
//   //What is the name of your favorite childhood friend?
//   securityQuestion3: function () {
//
//     return element.all(by.id('question3'));
//
//   },
//   incorrectEmailFormat: function () {
//
//     return element(by.css('p[ng-show="forgotUserNameValidity.email.$error.email"]'));
//
//   },
//   submitPassword: function () {
//
//     return element(by.id("forgotPasswordSubmit"));
//
//   },
//   userName: function () {
//
//     return element(by.id("userName"));
//
//   },
//   email: function () {
//
//     return element(by.id("email"));
//
//   },
//   emailNotFound: function () {
//
//     return element(by.css('p[ng-show="userNameRecovery.failed"]'));
//
//   },
//   emailNotFoundNumbers: function () {
//
//     return element.all(by.css('.error-table')).first();
//
//   },
//   disabledFields: function () {
//
//     return element.all(by.css('input[disabled="disabled"]'));
//
//   },
//
//   submitUsername: function () {
//
//     return element(by.id("forgotUsernameSubmit"));
//
//   },
//
//   //Locator End
//
//   //Clicking
//   clickPasswordSubmit: function () {
//
//     this.submitPassword().click();
//     browser.sleep(browser.params.shortDelay);
//
//   },
//   clickUsernameSubmit: function () {
//
//     this.submitUsername().click();
//     browser.sleep(browser.params.shortDelay);
//   },
//
//   //Getting
//   getPasswordErrorTextPhoneNumber: function () {
//     return this.passwordErrorPhoneNumbers().get(2).getText();
//
//   },
//   getPasswordErrorText: function () {
//
//
//     return this.passwordErrorText().getText();
//
//   },
//   getSecurityQuestion6Text: function () {
//
//
//     return this.securityQuestion6Text().getText();
//
//   },
//   getSecurityQuestion9Text: function () {
//
//
//     return this.securityQuestion9Text().getText();
//
//   },
//   getSecurityQuestion10Text: function () {
//
//
//     return this.securityQuestion10Text().getText();
//
//   },
//   getIncorrectEmailFormat: function () {
//
//
//     return this.incorrectEmailFormat().getText();
//
//   },
//   getemailNotFoundNumbers: function () {
//
//
//     return this.emailNotFoundNumbers().getText();
//
//   },
//
//   getemailNotFoundText: function () {
//
//
//     return this.emailNotFound().getText();
//
//   },
//   getSubmitButtonText: function () {
//
//
//     return this.submitUsername().getText();
//
//   },
//
//   //Sending
//   enterQuestion9: function (param) {
//
//     return this.securityQuestion9().clear().sendKeys(param);
//
//   },
//
//   enterQuestion6: function (param) {
//
//     return this.securityQuestion6().clear().sendKeys(param);
//
//   },
//
//   enterQuestion10: function (param) {
//
//     return this.securityQuestion10().clear().sendKeys(param);
//
//   },
//
//   //enterQuestion5: function (param) {
//   //
//   //  return this.securityQuestion5().sendKeys(param);
//   //
//   //},
//   //enterQuestion3: function (param) {
//   //
//   //  return this.securityQuestion3().sendKeys(param);
//   //
//   //},
//   enterUsername: function (param) {
//
//     return this.userName().clear().sendKeys(param);
//
//   },
//   enterEmail: function (param) {
//     browser.sleep(browser.params.shortDelay);
//     this.email().clear().sendKeys(param);
//
//   },
//
//   //Count
//   disabledCount: function () {
//
//     return this.disabledFields().count();
//
//   },
//   //LAST ONE
//   placeholder: function (index) {
//
//     this._thumbnail(index).click();
//
//   }
// };
module.exports.newLogin = newLogin;
//module.exports = loginRecover;
