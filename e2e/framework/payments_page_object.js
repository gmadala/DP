'use strict';

var PaymentPageObject = function () {

  this.url = '#/payments';

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
  this.cancelExtensionModal = this.modal.element(by.cssContainingText('button', 'Cancel'));
  this.cancelScheduledModal = this.modal.element(by.cssContainingText('button', 'No'));

  this.accountFeeSection = browser.element(by.cssContainingText('.well', 'Fees'));
  this.accountFeeRepeater = browser.element.all(by.repeater('fee in fees.results'));
  this.accountFeeTable = this.accountFeeSection.element(by.css('table'));
  this.accountFeeHeaders = ['Due Date', 'Fee Type', 'Description', 'Posted', 'Amount'];
  this.accountFeeColumns = ['fee.EffectiveDate', 'fee.FeeType', 'fee.Description', 'fee.Posted'];

  this.vehiclePaymentSection = browser.element(by.cssContainingText('.well', 'Vehicle'));
  this.vehiclePaymentRepeater = browser.element.all(by.repeater('payment in payments.results'));
  this.vehiclePaymentTable = this.vehiclePaymentSection.element(by.css('table'));
  this.vehiclePaymentHeaders = ['Due Date', 'Description', 'Floored', 'Status', 'Payment', 'Payoff'];
  this.vehicleNoticeBox = browser.element(by.cssContainingText('.notice-box', 'Sorry, no results found'));

  this.paymentSummaryMessage = browser.element(by.cssContainingText('p', 'You have not'));
  this.feePaymentQueue = browser.element.all(by.repeater('fee in paymentQueue.fees'));
  this.vehiclePaymentQueue = browser.element.all(by.repeater('payment in paymentQueue.payments'));

  // request extension links
  this.requestExtensionLinks = browser.element.all(by.cssContainingText('a', 'Extension'));
  // vehicle detail links
  this.vehicleDetailLinks = browser.element.all(by.cssContainingText('td', 'VIN'));
  // un-schedule payments
  this.unscheduleFeePaymentButtons = this.accountFeeTable.all(by.cssContainingText('button', 'Unschedule'));
  this.unscheduleVehiclePaymentButtons = this.vehiclePaymentTable.all(by.cssContainingText('button', 'Unschedule'));
  // schedule payments
  this.scheduleFeePaymentButtons = this.accountFeeTable.all(by.css('button:not(.btn-unstyle)'));
  this.scheduleVehiclePaymentButtons = this.vehiclePaymentTable.all(by.css('button:not(.btn-unstyle)'));
  this.checkoutButton = browser.element(by.cssContainingText('button', 'Checkout'));

  var getContents = function (tableElement, headerNames) {
    var promise = protractor.promise.defer();
    // ensure that the header equals to all('th').getText()
    expect(tableElement.all(by.css('th')).getText()).toEqual(headerNames);

    var counter = 0;
    var contents = [];
    var rows = tableElement.all(by.css('tr'));
    rows.count().then(function (count) {
      rows.each(function (row) {
        var cells = row.all(by.css('td'));
        cells.each(function (cell) {
          cell.getText().then(function (cellText) {
            contents.push(cellText);
            counter++;
            // all(by.css('tr')) will include tr for header,
            // but we don't want to count it in.
            if (counter >= (count - 1) * headerNames.length) {
              promise.fulfill(contents);
            }
          });
        });
      });
    });
    return promise;
  };

  this.formattedDataFromRepeater = function (repeater, column) {
    return browser.element.all(by.repeater(repeater).column(column)).map(function (element) {
      return element.getText();
    });
  };

  this.unformattedDataFromRepeater = function (repeater, column) {
    return browser.element.all(by.repeater(repeater)).map(function (element) {
      return element.evaluate(column);
    });
  };

  this.getVehiclePaymentsContent = function () {
    return getContents(this.vehiclePaymentTable, this.vehiclePaymentHeaders);
  };

  this.getAccountFeesContent = function () {
    return getContents(this.accountFeeTable, this.accountFeeHeaders);
  };

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

  this.getInventoryLocation = function () {
    var promise = protractor.promise.defer();
    this.inventoryLocations.each(function (inventoryLocation) {
      inventoryLocation.isDisplayed().then(function (displayed) {
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

  var getFirstElement = function (elementList) {
    return elementList.count().then(function (count) {
      if (count > 0) {
        return elementList.first();
      }
    });
  };

  this.getVehicleDetailLink = function () {
    var vehicleDetailLinks = this.vehicleDetailLinks;
    return vehicleDetailLinks.count().then(function (count) {
      if (count > 0) {
        return vehicleDetailLinks.first().element(by.css('a'));
      }
    });
  };

  this.getRequestExtensionLink = function () {
    return getFirstElement(this.requestExtensionLinks);
  };

  this.getScheduleVehiclePaymentButton = function () {
    return getFirstElement(this.scheduleVehiclePaymentButtons);
  };

  this.getUnscheduleVehiclePaymentButton = function () {
    return getFirstElement(this.unscheduleVehiclePaymentButtons);
  };

  this.getScheduleFeePaymentButton = function () {
    return getFirstElement(this.scheduleFeePaymentButtons);
  };

  this.getUnscheduleFeePaymentButton = function () {
    return getFirstElement(this.unscheduleFeePaymentButtons);
  };
};

module.exports = PaymentPageObject;
