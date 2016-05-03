'use strict';

// var longDelay = 1000;
var delay = 500;
var receiptObjects = {

  //Locators
  exportReceipts: function () {

    return element.all(by.css('button[ng-click="onExport()"]'));

  },

  firstReceipt: function () {

    return element.all(by.css('button[ng-click="toggleInQueue(receipt)"]'));

  },
  //End of locators. Locators need to go before this
  clickExportReceipts: function () {

    this.exportReceipts().get(0).click();
    browser.sleep(delay);

  },
  clickFirstReceipt: function () {

    this.firstReceipt().get(0).click();
    browser.sleep(delay);

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
