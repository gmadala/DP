var longDelay = 1000;
modal_objects = {

  //Locators

  modalHeader: function () {

    return element(by.css('.modal-header'));
    browser.sleep(longDelay);

  },
  modalBody: function () {

    return element(by.css('.modal-body'));
    browser.sleep(longDelay);

  },
  //Text on button will change but still same button(Ok, Close Window etc....)
  okButton: function () {

    return element(by.css('button[type="submit"]'));

  },

  //End of locators. Locators need to go before this

  //Functions can go below
  header: function () {

    return this.modalHeader().getText();

  },
  body: function () {

    return this.modalBody().getText();

  },

  //LAST ONE
  clickOkButton: function () {

    return this.okButton().click();

  }
};


module.exports = modal_objects;
