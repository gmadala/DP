'use strict';

describe('Payments page e2e', function () {

  var paymentsPage = require('../framework/payments_page_object.js');
  var datepickerPage = require('../framework/datepicker_page_object.js');

  beforeEach(function () {
    browser.ignoreSynchronization = true;
    paymentsPage.openPage();
    paymentsPage.waitForPage();
  });

  it('should validate payments page object is accessing the correct fields.', function () {
    expect(paymentsPage.searchField.isDisplayed()).toBeTruthy();
    expect(paymentsPage.searchFilter.isDisplayed()).toBeTruthy();
    expect(paymentsPage.getInventoryLocation()).toBeDefined();
    paymentsPage.getInventoryLocation().then(function(inventoryLocation) {
      expect(inventoryLocation.isDisplayed()).toBeTruthy();
    });

    expect(paymentsPage.searchButton.isDisplayed()).toBeTruthy();
    expect(paymentsPage.clearSearchButton.isDisplayed()).toBeTruthy();
  });

  it('should validate payments page object is accessing the correct option fields.', function () {
    expect(paymentsPage.searchFilterOptions.count()).toEqual(4);
    // filter only gets displayed if the options is more than 2
    expect(paymentsPage.inventoryLocationOptions.count()).toBeGreaterThan(2);
  });

  it('should validate payments page object is accessing the correct range fields.', function () {
    expect(paymentsPage.searchStartDate.isDisplayed()).not.toBeTruthy();
    expect(paymentsPage.searchEndDate.isDisplayed()).not.toBeTruthy();
  });

  it('should validate payments page object is accessing the correct error message.', function () {
    expect(paymentsPage.errorMessage.isDisplayed()).not.toBeTruthy();
  });

  it('should display start date and end date when filter option selected is by date range.', function () {
    expect(paymentsPage.getFilterOption()).toEqual('View All');
    paymentsPage.setFilterOption('Date Range');
    expect(paymentsPage.getFilterOption()).toEqual('Date Range');

    expect(paymentsPage.searchStartDate.isDisplayed()).toBeTruthy();
    expect(paymentsPage.searchEndDate.isDisplayed()).toBeTruthy();

    paymentsPage.setFilterOption('Due Today');
    expect(paymentsPage.getFilterOption()).toEqual('Due Today');

    expect(paymentsPage.searchStartDate.isDisplayed()).not.toBeTruthy();
    expect(paymentsPage.searchEndDate.isDisplayed()).not.toBeTruthy();
  });

  xit('should allow setting start date and end date using datepicker.', function() {
    paymentsPage.setFilterOption('Date Range');

    expect(paymentsPage.searchStartDate.isDisplayed()).toBeTruthy();
    expect(paymentsPage.searchEndDate.isDisplayed()).toBeTruthy();

    paymentsPage.clickSearchStartDate();
    expect(datepickerPage.datepicker.isDisplayed()).toBeTruthy();
    datepickerPage.setDate(30, 'Dec', 2001);

    paymentsPage.clickSearchEndDate();
    expect(datepickerPage.datepicker.isDisplayed()).toBeTruthy();
    datepickerPage.setDate(28, 'Jan', 2011);
  });

  it('should verify that user is able to enter text in search field.', function () {
    var searchString = 'Example search object!';
    paymentsPage.setSearchField(searchString);
    expect(paymentsPage.getSearchField()).toEqual(searchString);
  });

  it('should verify that search field have the correct watermark.', function() {
    var watermark = 'By Stock #, VIN, or Description';
    expect(paymentsPage.searchField.getAttribute('placeholder')).toEqual(watermark);
  });

  // Start of WMT-53
  it('should open request extension modal when request extension is clicked', function() {
    expect(paymentsPage.requestExtensionLinks.count()).toBeGreaterThan(0);
    expect(paymentsPage.getActiveRequestExtensionLink()).toBeDefined();
    paymentsPage.getActiveRequestExtensionLink().then(function(requestExtensionLink) {
      requestExtensionLink.click();
    });
    var modalHeaderText = 'Request Extension';
    expect(paymentsPage.modal.isDisplayed()).toBeTruthy();
    expect(paymentsPage.getModalHeaderText()).toEqual(modalHeaderText);
  });

  it('should navigate to vehicle details when vehicle description is clicked', function() {
    expect(browser.getCurrentUrl()).toContain(paymentsPage.url);
    expect(paymentsPage.vehicleDetailLinks.count()).toBeGreaterThan(0);
    expect(paymentsPage.getActiveVehicleDetailLink()).toBeDefined();
    paymentsPage.getActiveVehicleDetailLink().then(function(vehicleDetailLink) {
      vehicleDetailLink.click();
    });
    expect(browser.getCurrentUrl()).not.toContain(paymentsPage.url);
  });

  it('should navigate to checkout when checkout is clicked', function() {
    expect(browser.getCurrentUrl()).toContain(paymentsPage.url);
    expect(paymentsPage.schedulePaymentButtons.count()).toBeGreaterThan(0);
    expect(paymentsPage.getActiveSchedulePaymentButton()).toBeDefined();
    paymentsPage.getActiveSchedulePaymentButton().then(function(schedulePaymentButton) {
      schedulePaymentButton.click();
    });
    expect(paymentsPage.checkoutButton.isDisplayed()).toBeTruthy();
    paymentsPage.checkoutButton.click();
    expect(browser.getCurrentUrl()).not.toContain(paymentsPage.url);
  });

  it('should open cancel payment modal when unschedule link is clicked', function() {
    expect(paymentsPage.unschedulePaymentButtons.count()).toBeGreaterThan(0);
    expect(paymentsPage.getActiveUnschedulePaymentButton()).toBeDefined();
    paymentsPage.getActiveUnschedulePaymentButton().then(function(unschedulePaymentButton) {
      unschedulePaymentButton.click();
    });
    var modalHeaderText = 'Cancel';
    expect(paymentsPage.modal.isDisplayed()).toBeTruthy();
    expect(paymentsPage.getModalHeaderText()).toContain(modalHeaderText);
  });
  // End of WMT-53

});
