'use strict';

var UtilObject = function () {
};

UtilObject.prototype = Object.create({}, {

  // common functionality for all the forms
  logoutnothanksbutton: {
    get: function () {
      var modal = browser.element(by.css('.modal'));
      return modal.element(by.cssContainingText('button', 'No'));
    }
  },

  logoutyesbutton: {
    get: function () {
      var modal = browser.element(by.css('.modal'));
      return modal.element(by.cssContainingText('button', 'Yes'));
    }
  },

  //Navigation
  goToLogoutYesButton: {
    value: function () {
      this.logoutyesbutton.click();
    }
  },

  goToLogoutNoThanksButton: {
    value: function () {
      this.logoutnothanksbutton.click();
    }
  },

  okbutton: {
    get: function () {
      var modal = browser.element(by.css('.modal'));
      return modal.element(by.css('button'));
    }
  },

  goToOKButton: {
    value: function () {
      this.okbutton.click();
      browser.waitForAngular();
    }
  }

});

module.exports = UtilObject;
