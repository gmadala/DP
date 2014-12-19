'use strict';

var RecoverPageObject = function () {
};

RecoverPageObject.prototype = Object.create({}, {

  recoverUrl: {
    value: 'http://localhost:9000/#/login/recover'
  },

  // Locators
  recoveremailaddress: {
    get: function () {
      return browser.element(by.model('userNameRecovery.email'));
    }
  },

  recoverusername: {
    get: function () {
      return browser.element(by.model('passwordRecovery.username'));
    }
  },
  okbutton: {
    get: function () {
      return browser.element(by.css('[ng-click="close(btn.result)"]'));
    }
  },

  usernamerecoverysubmit: {
    get: function () {
      return browser.element(by.css('[ng-click="userNameRecovery.submit()"]')); //by.buttonText("Submit")); //
    }
  },

  passwordrecoverysubmit: {
    get: function () {
      return browser.element(by.css('[ng-click="passwordRecovery.submit()"]'));
    }
  },

  securityquestionzero: {
    get: function () {
      return browser.element(by.id('question0'));
    }
  },

  securityquestionone: {
    get: function () {
      return browser.element(by.id('question1'));
    }
  },

  //Setters
  setRecoveryEmailAddress: {
    value: function (recemailaddress) {
      this.recoveremailaddress.sendKeys(recemailaddress);
      browser.waitForAngular();
    }
  },

  setRecoveryUsername: {
    value: function (recusername) {
      this.recoverusername.sendKeys(recusername);
      browser.waitForAngular();
    }
  },

  setSecurityQuestionZero: {
    value: function (question0) {
      this.securityquestionzero.sendKeys(question0);
      browser.waitForAngular();
    }
  },

  setSecurityQuestionOne: {
    value: function (question1) {
      this.securityquestionone.sendKeys(question1);
      browser.waitForAngular();
    }
  },

  //Doers
  doEmailAddress: {
    value: function (recemailaddress) {
      this.setRecoveryEmailAddress(recemailaddress);
      this.goToRecoveryUser();
      browser.waitForAngular();
    }
  },

  doUsername: {
    value: function (recusername) {
      this.setRecoveryUsername(recusername);
      this.goToRecoveryPassword();
      browser.waitForAngular();
    }
  },

  doSecurityQuestions: {
    value: function (question0, question1) {
      this.setSecurityQuestionZero(question0);
      this.setSecurityQuestionOne(question1);
      this.goToRecoveryPassword();
      browser.waitForAngular();
    }
  },

  //Navigation
  goToRecoveryUser: {
    value: function () {
      this.usernamerecoverysubmit.click();
      browser.waitForAngular();
    }
  },

  goToRecoveryPassword: {
    value: function () {
      this.passwordrecoverysubmit.click();
      browser.waitForAngular();
    }
  },

  goToOKButton: {
    value: function () {
      this.okbutton.click();
      browser.waitForAngular();
    }
  }

});

module.exports = RecoverPageObject;
