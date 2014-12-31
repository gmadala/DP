'use strict';

var PaymentPageObject = function () {

  this.url = '#/titlereleases';

  this.openPage = function () {
    browser.get(this.url);
  };

  this.waitForPage = function () {
    var searchField = this.searchField;
    browser.driver.wait(function () {
      return searchField.isPresent();
    }, 3000);
  };

  /** Locator of elements **/
  this.searchField = browser.element(by.model('activeCriteria.query'));
  // vehicle description links
  this.vehicleDescriptionLinks = browser.element.all(by.css('a.lockup-major'));
  // request title buttons
  this.requestTitleButtons = browser.element.all(by.css('.actions .btn-title-request'));
  // request title unavailable links
  this.requestTitleUnavailableLinks = browser.element.all(by.css('.actions a'));
  // export receipt button
  this.confirmRequestsButton = browser.element(by.css('.btn-cta'));

  // modal and the modal header
  this.modal = browser.element(by.css('.modal'));
  this.modalHeader = browser.element(by.css('.modal-header'));

  /** Setter and getter for elements **/
  this.getActiveVehicleDescriptionLink = function () {
    var promise = protractor.promise.defer();
    this.vehicleDescriptionLinks.each(function (vehicleDescriptionLink) {
      promise.fulfill(vehicleDescriptionLink);
    });
    return promise;
  };

  this.getActiveRequestTitleUnavailableLink = function() {
    var promise = protractor.promise.defer();
    this.requestTitleUnavailableLinks.each(function (requestTitleUnavailableLink) {
      promise.fulfill(requestTitleUnavailableLink);
    });
    return promise;
  };

  this.getActiveRequestTitleButton = function () {
    var promise = protractor.promise.defer();
    this.requestTitleButtons.each(function (requestTitleButton) {
      promise.fulfill(requestTitleButton);
    });
    return promise;
  };

  this.getModalHeaderText = function () {
    return this.modalHeader.getText();
  };

};

module.exports = PaymentPageObject;
