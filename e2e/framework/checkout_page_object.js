'use strict';

var CheckoutPageObject = function () {
  this.url = '#/checkout';

  this.openPage = function () {
    browser.get(this.url);
  };

  this.waitForPage = function () {
    var submitPaymentsButton = this.submitPaymentsButton;
    browser.driver.wait(function () {
      return submitPaymentsButton.isPresent();
    }, 3000);
  };

  /** Locator of elements **/
  this.submitPaymentsButton = browser.element(by.css('.btn-cta'));

  // payments link
  this.paymentsPageLink = browser.element(by.cssContainingText('a', 'Payments list'));

  // vehicle detail links
  this.vehicleDetailLinks = browser.element.all(by.cssContainingText('td', 'VIN'));

  // payment option links
  this.paymentOptionButtons = browser.element.all(by.cssContainingText('button', 'Payment Options'));

  // remove payment link
  this.removePaymentButtons = browser.element.all(by.cssContainingText('button', 'Remove'));

  // modal and the modal header
  this.modal = browser.element(by.css('.modal'));
  this.modalHeader = browser.element(by.css('.modal-header'));

  /** Setter and getter for elements **/

  this.getModalHeaderText = function () {
    return this.modalHeader.getText();
  };

  this.getVehicleDetailLink = function () {
    var vehicleDetailLinks = this.vehicleDetailLinks;
    return vehicleDetailLinks.count().then(function (count) {
      if (count > 0) {
        return vehicleDetailLinks.first().element(by.css('a'));
      }
    });
  };

  this.getActivePaymentOptionButton = function () {
    var promise = protractor.promise.defer();
    this.paymentOptionButtons.each(function (paymentOptionButton) {
      promise.fulfill(paymentOptionButton);
    });
    return promise;
  };

};

module.exports = CheckoutPageObject;
