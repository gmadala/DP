/**
 * Created by Javier.Calderon on 4/5/2016.
 */
var longDelay = 1000;
var delay = 500;
receiptObjects = {

  //Locators
  exportReceipts: function () {

    return element.all(by.css('button[ng-click="onExport()"]'));
    browser.sleep(longDelay);

  },

  firstReceipt: function () {

    return element.all(by.css('button[ng-click="toggleInQueue(receipt)"]'));
    browser.sleep(longDelay);

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
