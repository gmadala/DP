'use strict';

function Receipts() {

  //Locators
  this.elReceiptsLabel = browser.element(by.css('div.search-form'));
  this.elClearSearch = browser.element(by.css('button#clearSearch.btn-unstyle.right.clear-search'));
  this.elExportReceipts = browser.element.all(by.css('button[ng-click="onExport()"]'));
  this.elFirstReceipt = browser.element.all(by.css('button[ng-click="toggleInQueue(receipt)"]'));

  //Getters

  this.getTestClearSearch = function () {
    browser.sleep(browser.params.shortDelay);
    return this.elClearSearch.getText();
  };

  //Doers
  this.doExportReceipts = function () {
    browser.sleep(browser.params.shortDelay);
    this.elExportReceipts.get(0).click();
  };
  this.doFirstReceipt = function () {
    browser.sleep(2000);
    browser.sleep(browser.params.shortDelay);
    this.elFirstReceipt.get(0).click();
  };

}
module.exports.receipts = Receipts;
