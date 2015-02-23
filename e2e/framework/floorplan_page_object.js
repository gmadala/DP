/**
 * Created by gayathrimadala on 12/23/14.
 */
'use strict';

var FloorPlanObject = function () {
};

FloorPlanObject.prototype = Object.create({}, {

  floorPlanUrl: {
    value: '#/floorplan'
  },
  //Locators
  startDate: {
    get: function () {
      return browser.element(by.model('activeCriteria.startDate'));
    }
  },
  endDate: {
    get: function () {
      return browser.element(by.model('activeCriteria.endDate'));
    }
  },
  searchFloorPlan: {
    get: function () {
      return browser.element(by.model('activeCriteria.query'));
    }
  },
  clearSearch: {
    get: function () {
      return browser.element(by.id('clearSearch'));
    }
  },
  floorPlanLinks: {
    get: function () {
      return browser.element.all(by.css('a.lockup-major'));
    }
  },
  floorPlanSearch: {
    get: function () {
      return browser.element(by.id('floorPlanSearch'));
    }
  },
  invLocations: {
    get: function () {
      return browser.element.all(by.model('activeCriteria.inventoryLocation'));
    }
  },
  invLocationsOptions: {
    get: function () {
      return browser.element.all(by.options('i.value as i.label for i in inventoryLocations'));
    }
  },

  waitForPage: {
    get: function () {
      var floorPlanField = this.floorPlanSearch;
      return browser.wait(function () {
        return floorPlanField.isPresent();
      }, 3000);
    }
  },
  searchButton: {
    get: function () {
      return browser.element(by.css('button.btn-input'));
    }
  },
  clearSearchButton: {
    get: function () {
      return browser.element(by.css('button.clear-search'));
    }
  },

  noResults:{
    get: function () {
      return browser.element(by.css('.notice-box'));
    }
  },

  floored:{
    get: function(){
      return browser.element(by.cssContainingText('span','Floored'));
    }
  },
  floorDescription:{
    get: function () {
      return browser.element(by.cssContainingText('span', 'Description'));
    }
  },
  floorStatus: {
    get: function() {
      return browser.element(by.cssContainingText('span','Status'));
    }
  },
  purchased: {
    get: function() {
      return browser.element(by.cssContainingText('span', 'Purchased'));
    }
  },
  seller: {
    get:  function () {
      return browser.element(by.cssContainingText('span', 'Seller'));
    }
  },
  lastPayment: {
    get: function () {
      return browser.element(by.cssContainingText('span', 'Last Payment'));
    }
  },
  floorTitle: {
    get: function () {
      return browser.element(by.cssContainingText('span', 'Title'));
    }
  },

  //Content

  findAFloor :{
    get: function () {
      return browser.element(by.cssContainingText('span', 'Find a Floor Plan'));
    }
  },
  flooringStatus:{
    get: function () {
      return browser.element(by.cssContainingText('label', 'Filter by Flooring Status'));
    }
  },
  filterSelect: {
    get: function() {
      return browser.element(by.id('filterSelect'));
    }
  },
  filterSelectOptions:{
    get: function () {
      return browser.element.all(by.options('o.value as o.label for o in filterOptions'));
    }
  },

  floorplanTableData:{
    get: function () {
      return browser.element(by.css('table'));
    }
  },

  floorplanDataHeaders: {
    get: function () {
      return this.floorplanTableData.all(by.css('thead th'));
    }
  },
  floorplanDataRows: {
    get: function () {
      return this.floorplanTableData.all(by.css('tbody tr'));
    }
  },

  floorPlanData:{
    get: function () {
      return browser.element.all(by.repeater('item in floorplanData.results'));
    }
  },

  dataHeaders:{
    get:function() {
      return ['Floored', 'Description', 'Status', 'Purchased', 'Seller', 'Last Payment', 'Title'];
    }
  },
  columnValues: {
    get: function(){
      return ['item.FlooringDate', 'item.Description','item.UnitVIN','item.StockNumber','item.FloorplanStatusName','item.UnitPurchaseDate','item.SellerName','item.LastPaymentDate','item.TitleImageAvailable'];
    }
  },

//columns Data
  flooredDays: {
    get: function () {
      return browser.element.all(by.repeater('item in floorplanData.results').column('item.FlooringDate'));
    }
  },
  floorDescriptionData: {
    get: function () {
      return browser.element.all(by.css('.description-narrow'));
    }
  },
  flooredStatusData: {
    get: function () {
      return browser.element.all(by.repeater('item in floorplanData.results').column('item.FloorplanStatusName'));
    }
  },
  floorPurchasedData: {
    get: function () {
      return browser.element.all(by.repeater('item in floorplanData.results').column('item.UnitPurchaseDate'));
    }
  },
  floorSellerData: {
    get: function () {
      return browser.element.all(by.repeater('item in floorplanData.results').column('item.SellerName'));
    }
  },
  floorLastPaymentData: {
    get: function () {
      return browser.element.all(by.repeater('item in floorplanData.results').column('item.LastPaymentDate'));
    }
  },
  floorTitleData: {
    get: function () {
      return browser.element.all(by.css('.btn.btn-square'));
    }
  },

  setFilterSelectOptions: {
    get: function (filterSelectOptValue) {
      this.filterSelectOptions.each(function (option) {
        option.getText().then(function (name) {
          if (name === filterSelectOptValue) {
            option.click();
          }
        });
      });
    }
  },

  getFilterSelectOptions: {
    value: function () {
      var promise = protractor.promise.defer();
      this.filterSelectOptions.each(function (option) {
        option.isSelected().then(function (selected) {
          if (selected) {
            option.getText().then(function (text) {
              promise.fulfill(text);
            });
          }
        });
      });
      return promise;
    }
  },


  //Setters
  setStartDate: {
    value: function (startdate) {
      this.startDate.sendKeys(startdate);
      browser.waitForAngular();
    }
  },
  setEndDate: {
    value: function (enddate) {
      this.endDate.sendKeys(enddate);
      browser.waitForAngular();
    }
  },
  setSearchFloorPlan: {
    value: function (searchVIN) {
      this.searchFloorPlan.sendKeys(searchVIN);
      browser.waitForAngular();
    }
  },
  //Doers
  doStartDate: {
    value: function (startdate) {
      this.setStartDate(startdate);
      browser.waitForAngular();
    }
  },
  doEndDate: {
    value: function (enddate) {
      this.setEndDate(enddate);
      browser.waitForAngular();
    }
  },
  doSearchFloorPlan: {
    value: function (searchVIN) {
      this.setSearchFloorPlan(searchVIN);
      browser.waitForAngular();
    }
  },
  //Navigation
  goToFlooringStatus: {
    value: function () {
      browser.element(by.model('activeCriteria.filter')).$('[value="0"]').click();
      browser.element(by.model('activeCriteria.filter')).$('[value="1"]').click();
      browser.element(by.model('activeCriteria.filter')).$('[value="2"]').click();
      browser.element(by.model('activeCriteria.filter')).$('[value="3"]').click();
      browser.element(by.model('activeCriteria.filter')).$('[value="4"]').click();
    }
  },

  getInventoryLocation: {
    value: function () {
      var promise = protractor.promise.defer();
      this.invLocations.each(function (inventoryLocation) {
        inventoryLocation.isDisplayed().then(function (displayed) {
          if (displayed) {
            promise.fulfill(inventoryLocation);
          }
        });
      });
      return promise;
    }
  },

  goToFloorPlanLinks: {
    value: function () {
      var promise = protractor.promise.defer();
      this.floorPlanLinks.each(function (floorPlanLink) {
        promise.fulfill(floorPlanLink);
      });
      return promise;
    }
  },

  goToFloorPlanSearch: {
    value: function () {
      this.floorPlanSearch.click();
    }
  }

});

module.exports = FloorPlanObject;
