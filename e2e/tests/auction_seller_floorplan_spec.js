'use strict';

var AuctionHelperObject = require('../framework/auction_helper_object');
var DatepickerObject = require('../framework/datepicker_page_object.js');
var AuctionSellerFloorPlanObject = require('../framework/auction_seller_floorplan_object');

var auctionHelper = new AuctionHelperObject();
var datepickerObject = new DatepickerObject();
var auctionFloorPlan = new AuctionSellerFloorPlanObject();

auctionHelper.describe('WMT-77', function () {
  describe('Auction Portal – Seller Floor Plan Search Content', function () {
    beforeEach(function () {
      auctionFloorPlan.openPage();
      auctionFloorPlan.waitForPage();
    });

    it('Should contains search, filter, start date and end date field and note for the date', function () {
      var searchQuery = 'Search Query';
      expect(auctionFloorPlan.searchField.isDisplayed()).toBeTruthy();
      expect(auctionFloorPlan.getSearchQuery()).not.toEqual(searchQuery);
      auctionFloorPlan.setSearchQuery(searchQuery);
      expect(auctionFloorPlan.getSearchQuery()).toEqual(searchQuery);

      var searchFilter = 'Completed/Not Paid';
      expect(auctionFloorPlan.searchFilterSelection.isDisplayed()).toBeTruthy();
      expect(auctionFloorPlan.getFilterOption()).not.toEqual(searchFilter);
      auctionFloorPlan.setFilterOption(searchFilter);
      expect(auctionFloorPlan.getFilterOption()).toEqual(searchFilter);

      var startDate = '05/10/2014';
      expect(auctionFloorPlan.searchStartDateField.isDisplayed()).toBeTruthy();
      expect(auctionFloorPlan.getSearchStartDate()).not.toEqual(startDate);
      auctionFloorPlan.searchStartDateField.click();
      expect(datepickerObject.datepicker.isDisplayed()).toBeTruthy();
      datepickerObject.setDate(10, 'May', 2014);
      expect(auctionFloorPlan.getSearchStartDate()).toEqual(startDate);

      var endDate = '12/13/2014';
      expect(auctionFloorPlan.searchEndDateField.isDisplayed()).toBeTruthy();
      expect(auctionFloorPlan.getSearchEndDate()).not.toEqual(endDate);
      auctionFloorPlan.searchEndDateField.click();
      expect(datepickerObject.datepicker.isDisplayed()).toBeTruthy();
      datepickerObject.setDate(13, 'Dec', 2014);
      expect(auctionFloorPlan.getSearchEndDate()).toEqual(endDate);

      expect(auctionFloorPlan.formTip.isDisplayed()).toBeTruthy();
    });

    xit('Should contains a message with action to start new search when search return no results.', function () {
    });

    var repeater = 'item in floorplanData.results';
    var dataFromRepeater = function (repeater, column, row) {
      if (row) {
        return browser.element.all(by.repeater(repeater).row(row).column(column));
      } else {
        return browser.element.all(by.repeater(repeater).column(column));
      }
    };

    it('Should contains all the correct headers for the search results.', function () {
      expect(auctionFloorPlan.floorplanDataHeaders.count()).toBe(8);
      var expectedHeaders = ['Dates', 'Description', 'Status', 'Purchased For', 'Buyer', 'Ticket No.', 'Title Location', 'Title'];
      // check if the header of the repeating elements is correct
      auctionFloorPlan.floorplanDataHeaders.each(function (floorplanDataHeader) {
        floorplanDataHeader.getText().then(function (headerText) {
          expect(expectedHeaders).toContain(headerText);
        });
      });
      // check if the floor plan data column is visible or not.
      auctionFloorPlan.columnNames.forEach(function (columnName) {
        var column = dataFromRepeater(repeater, columnName);
        column.each(function (columnData) {
          expect(columnData.isDisplayed()).toBeTruthy();
        });
      });
    });

    it('Should contains floored and disbursement date for the date column of the search results.', function () {
      var flooringDateColumn = 'item.FlooringDate';
      var disbursementDateColumn = 'item.DisbursementDate';

      var flooringDates = dataFromRepeater(repeater, flooringDateColumn);
      var disbursementDates = dataFromRepeater(repeater, disbursementDateColumn);
      expect(flooringDates.count()).toEqual(disbursementDates.count());

      flooringDates.count().then(function (count) {
        for (var i = 0; i < count; i++) {
          var flooringDate = dataFromRepeater(repeater, flooringDateColumn, i);
          var disbursementDate = dataFromRepeater(repeater, disbursementDateColumn, i);
        }
      });
    });

    xit('Should contains vehicle description and vin for the description column of the search results.', function () {
    });

    xit('Should contains title owner and selector indicating seller have the title for the title location column.', function () {
    });

    xit('Should display icon to view title when scanned title is available on the title column.', function () {
    });

    xit('Should not display icon when the scanned title is not available.', function () {
    });
  });
});
