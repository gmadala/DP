'use strict';

var AuctionSellerFloorPlan = function () {

  this.url = '#/act/sellerfloorplan';

  this.searchField = browser.element(by.model('activeCriteria.query'));
  this.searchFilterSelection = browser.element(by.model('activeCriteria.filter'));
  this.searchEndDateField = browser.element(by.model('activeCriteria.endDate'));
  this.searchStartDateField = browser.element(by.model('activeCriteria.startDate'));

  this.searchFilterOptions = browser.element.all(by.options('o.value as o.label for o in filterOptions'));

  this.formTip = browser.element(by.css('.form-tip'));

  this.floorplanData = browser.element(by.css('table'));
  this.floorplanDataHeaders = this.floorplanData.all(by.css('thead th'));
  this.floorplanDataRows = this.floorplanData.all(by.css('tbody tr'));

  // by-repeater only takes element that have class ng-bind and ng-scope
  // see: https://github.com/angular/protractor/issues/294
  this.floorplanData = browser.element.all(by.repeater('item in floorplanData.results'));
  this.dataHeaders = ['Dates', 'Description', 'Status', 'Purchased For', 'Buyer', 'Ticket No.', 'Title Location', 'Title'];
  this.columnNames = ['item.FlooringDate', 'item.DisbursementDate', 'item.Description', 'item.UnitVIN',
    'item.FloorplanStatusName', 'item.PurchaseAmount', 'item.BuyerName', 'item.ConsignerTicketNumber',
    'item.TitleLocation', 'item.TitleEditable', 'item.FloorplanId', 'item.sellerHasTitle', 'item.TitleImageAvailable'];

  this.openPage = function () {
    browser.get(this.url);
  };

  this.waitForPage = function () {
    var searchField = this.searchField;
    browser.driver.wait(function () {
      return searchField.isPresent();
    }, 3000);
  };

  this.setSearchQuery = function (searchString) {
    this.searchField.sendKeys(searchString);
  };

  this.getSearchQuery = function () {
    return this.searchField.getAttribute('value');
  };

  this.getSearchEndDate = function () {
    return this.searchEndDateField.getAttribute('value');
  };

  this.getSearchStartDate = function () {
    return this.searchStartDateField.getAttribute('value');
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
};

module.exports = AuctionSellerFloorPlan;
