modal_objects = {

  //Locators

  modalHeader: function () {

    return element(by.css('.modal-header'));

  },
  modalBody: function () {

    return element(by.css('.modal-body'));

  },
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
