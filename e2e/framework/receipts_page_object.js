'use strict';

var PaymentPageObject = function () {

  this.url = '#/receipts';

  this.openPage = function () {
    browser.get(this.url);
  };

  this.waitForPage = function () {
    var searchField = this.searchField;
    browser.wait(function () {
      return searchField.isPresent();
    }, 3000);
  };

  /** Locator of elements **/
  this.searchField = browser.element(by.model('activeCriteria.query'));
  // receipt links
  this.viewReceiptLinks = browser.element.all(by.css('a.lockup-major'));
  // button add receipts
  this.addReceiptButtons = browser.element.all(by.css('.btn-adapts'));
  // export receipt button
  this.exportReceiptsButton = browser.element(by.css('.btn-cta'));

  /** Setter and getter for elements **/
  this.getActiveViewReceiptLink = function () {
    var promise = protractor.promise.defer();
    this.viewReceiptLinks.each(function (viewReceiptLink) {
      promise.fulfill(viewReceiptLink);
    });
    return promise;
  };

  this.getActiveAddReceiptButton = function () {
    var promise = protractor.promise.defer();
    this.addReceiptButtons.each(function (addReceiptButton) {
      promise.fulfill(addReceiptButton);
    });
    return promise;
  };

};

module.exports = new PaymentPageObject();
