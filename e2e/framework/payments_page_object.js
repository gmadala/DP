'use strict';

var PaymentPageObject = function () {

  this.url = '#/payments';

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
  this.searchFilterSelection = browser.element(by.model('activeCriteria.filter'));
  this.searchEndDateField = browser.element(by.model('activeCriteria.endDate'));
  this.searchStartDateField = browser.element(by.model('activeCriteria.startDate'));
  this.inventoryLocations = browser.element.all(by.model('activeCriteria.inventoryLocation'));

  this.searchFilterOptions = browser.element.all(by.options('o.value as o.label for o in filterOptions'));
  this.inventoryLocationOptions = browser.element.all(by.options('i.value as i.label for i in inventoryLocations'));

  this.searchButton = browser.element(by.css('button.btn-input'));
  this.clearSearchButton = browser.element(by.css('button.clear-search'));

  this.errorMessage = browser.element(by.css('label.text-error'));

  // modal and the modal header
  this.modal = browser.element(by.css('.modal'));
  this.modalHeader = browser.element(by.css('.modal-header'));

  // request extension links
  this.requestExtensionLinks = browser.element.all(by.css('.paired a'));

  // vehicle detail links
  this.vehicleDetailLinks = browser.element.all(by.css('.description-narrow a'));

  // unschedule payments
  this.unschedulePaymentButtons = browser.element.all(by.css('#paymentsSearchTable .btn-link'));

  // schedule payments
  this.schedulePaymentButtons = browser.element.all(by.css('#paymentsSearchTable .btn-adapts'));

  this.checkoutButton = browser.element(by.css('.btn-cta'));

  /** Setter and getter for elements **/
  this.setSearchField = function (searchString) {
    this.searchField.sendKeys(searchString);
  };

  this.getSearchField = function () {
    return this.searchField.getAttribute('value');
  };

  this.setFilterOption = function (optionName) {
    this.searchFilterOptions.each(function (option) {
      option.getText().then(function (name) {
        if (name === optionName) {
          option.click();
        }
      });
    });
  };

  this.getFilterOption = function () {
    var promise = protractor.promise.defer();
    this.searchFilterOptions.each(function (option) {
      option.isSelected().then(function (selected) {
        if (selected) {
          promise.fulfill(option.getText());
        }
      });
    });
    return promise;
  };

  this.getInventoryLocation = function() {
    var promise = protractor.promise.defer();
    this.inventoryLocations.each(function(inventoryLocation) {
      inventoryLocation.isDisplayed().then(function(displayed) {
        if (displayed) {
          promise.fulfill(inventoryLocation);
        }
      });
    });
    return promise;
  };

  this.clickSearchEndDate = function () {
    this.searchEndDateField.click();
  };

  this.getSearchEndDate = function () {
    return this.searchEndDateField.getAttribute('value');
  };

  this.clickSearchStartDate = function () {
    this.searchStartDateField.click();
  };

  this.getSearchStartDate = function () {
    return this.searchStartDateField.getAttribute('value');
  };

  this.getModalHeaderText = function () {
    return this.modalHeader.getText();
  };

  this.getActiveRequestExtensionLink = function () {
    var promise = protractor.promise.defer();
    this.requestExtensionLinks.each(function (requestExtensionLink) {
      requestExtensionLink.isDisplayed().then(function (displayed) {
        if (displayed) {
          promise.fulfill(requestExtensionLink);
        }
      });
    });
    return promise;
  };

  this.getActiveVehicleDetailLink = function () {
    var promise = protractor.promise.defer();
    this.vehicleDetailLinks.each(function (vehicleDetailLink) {
      promise.fulfill(vehicleDetailLink);
    });
    return promise;
  };

  this.getActiveSchedulePaymentButton = function () {
    var promise = protractor.promise.defer();
    this.schedulePaymentButtons.each(function(schedulePaymentButton) {
      schedulePaymentButton.isDisplayed().then(function(displayed) {
        if (displayed) {
          promise.fulfill(schedulePaymentButton);
        }
      });
    });
    return promise;
  };

  this.getActiveUnschedulePaymentButton = function () {
    var promise = protractor.promise.defer();
    this.unschedulePaymentButtons.each(function (unschedulePaymentButton) {
      unschedulePaymentButton.isDisplayed().then(function (displayed) {
        if (displayed) {
          promise.fulfill(unschedulePaymentButton);
        }
      });
    });
    return promise;
  };

};

module.exports = PaymentPageObject;
