'use strict';

var receiptObjects = {

  //Locators
  exportReceipts: function () {

    return element.all(by.css('button[ng-click="onExport()"]'));

  },

  firstReceipt: function () {

    return element.all(by.css('button[ng-click="toggleInQueue(receipt)"]'));

  },
  //End of locators. Locators need to go before this
  clickExportReceipts: function() {
    browser.params.shortDelay();
    this.exportReceipts().get(0).click();

  },
  clickFirstReceipt: function() {
    browser.params.shortDelay();
    this.firstReceipt().get(0).click();


  },


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


module.exports = receiptObjects;
