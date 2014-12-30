/**
 * Created by gayathrimadala on 12/23/14.
 */
'use strict';

var FloorPlanObject = function () {
};

FloorPlanObject.prototype = Object.create({}, {

  floorPlanUrl:{ value: '#/floorplan'
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
  floorPlanSearch:{
    get: function () {
      return browser.element(by.id('floorPlanSearch'));
    }
  },
  invLocations: {
    get: function() {
      return browser.element.all(by.model('activeCriteria.inventoryLocation'));
    }
  },
  invLocationsOptions: {
    get: function() {
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
    get: function(){
      return browser.element(by.css('button.clear-search'));
    }
  },

  //Setters
  setStartDate :{
    value: function (startdate) {
      this.startDate.sendKeys(startdate);
      browser.waitForAngular();
    }
  },
  setEndDate :{
    value: function (enddate) {
      this.endDate.sendKeys(enddate);
      browser.waitForAngular();
    }
  },
  setSearchFloorPlan  :{
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
    value: function(){
      browser.element(by.model('activeCriteria.filter')).$('[value="0"]').click();
      browser.element(by.model('activeCriteria.filter')).$('[value="1"]').click();
      browser.element(by.model('activeCriteria.filter')).$('[value="2"]').click();
      browser.element(by.model('activeCriteria.filter')).$('[value="3"]').click();
      browser.element(by.model('activeCriteria.filter')).$('[value="4"]').click();
    }
  },

  getInventoryLocation:{
    value : function() {
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
    value: function(){
      var promise = protractor.promise.defer();
      this.floorPlanLinks.each(function (floorPlanLink) {
        promise.fulfill(floorPlanLink);
      });
      return promise;
    }
  },

  goToFloorPlanSearch: {
    value: function(){
      this.floorPlanSearch.click();
    }
  }

});

module.exports = FloorPlanObject;
