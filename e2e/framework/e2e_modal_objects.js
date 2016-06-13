'use strict';
var delay = 500;
var longDelay = 1000;
var modalObjects = {

  //Locators

  modalHeader: function () {

    return element(by.css('.modal-header'));

  },
  modalBody: function () {

    return element(by.css('.modal-body'));

  },
  //Text on button will change but still same button(Ok, Close Window etc....)
  okButton: function () {

    return element(by.css('button[type="submit"]'));

  },

  //End of locators. Locators need to go before this

  //Functions can go below
  header: function () {
    browser.sleep(longDelay);
    return this.modalHeader().getText();

  },
  body: function () {

    return this.modalBody().getText();

  },

  //LAST ONE
  clickOkButton: function () {

    return this.okButton().click();
    browser.sleep(delay);

  }
};


module.exports = modalObjects;
