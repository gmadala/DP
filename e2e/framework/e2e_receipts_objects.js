'use strict';

var receiptObjects = {

  //Locators
  exportReceipts: function () {
    return element.all(by.css('button[ng-click="onExport()"]'));
  },

  firstReceipt: function () {
    return element.all(by.css('button[ng-click="toggleInQueue(receipt)"]'));
  },

  //Doers
  clickExportReceipts: function () {
    browser.sleep(browser.params.shortDelay);
    this.exportReceipts().get(0).click();
  },
  clickFirstReceipt: function () {
    browser.sleep(browser.params.shortDelay);
    this.firstReceipt().get(0).click();
  }

};

module.exports = receiptObjects;


// function ReceiptsObjects() {
//
//   //Locators
//   this.elExportReceipts = browser.element.all(by.css('button[ng-click="onExport()"]'));
//   this.elFirstReceipt = browser.element.all(by.css('button[ng-click="toggleInQueue(receipt)"]'));
//
//   //Doers
//   this.doExportReceipts = function () {
//     browser.sleep(browser.params.shortDelay);
//     this.elExportReceipts().get(0).click();
//   };
//   this.doFirstReceipt = function () {
//     browser.sleep(2000);
//     browser.sleep(browser.params.shortDelay);
//     this.elFirstReceipt().get(0).click();
//   };
//
// }
// module.exports.ReceiptsObjects = ReceiptsObjects;
