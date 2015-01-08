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
    var dataFromRepeater = function (repeater, column) {
      return browser.element.all(by.repeater(repeater).column(column));
    };

    var contentWithMarker = function () {
      var counter = 0;
      var contents = [];
      var parameters = arguments;
      var promise = protractor.promise.defer();
      auctionFloorPlan.floorplanDataRows.count().then(function (count) {
        auctionFloorPlan.floorplanDataRows.each(function (row) {
          var cells = row.all(by.css('td'));
          cells.each(function (cell) {
            cell.getText().then(function (text) {
              var notFound = false;
              for (var i = 0; i < parameters.length; i++) {
                var argument = parameters[i].toString();
                if (text.indexOf(argument) === -1) {
                  notFound = true;
                  break;
                }
              }
              if (!notFound) {
                counter++;
                contents.push(text);
                if (counter >= count) {
                  promise.fulfill(contents);
                }
              }
            });
          });
        });
      });
      return promise;
    };

    var textInContents = function (contents, text) {
      // check if one of the 'contents' array element contains 'text'
      var found = false;
      contents.forEach(function (content) {
        if (content.indexOf(text) !== -1) {
          found = true;
        }
      });
      return found;
    };

    it('Should contains all the correct headers for the search results.', function () {
      expect(auctionFloorPlan.floorplanDataHeaders.count()).toBe(8);
      // check if the header of the repeating elements is correct
      auctionFloorPlan.floorplanDataHeaders.each(function (floorplanDataHeader) {
        floorplanDataHeader.getText().then(function (headerText) {
          expect(auctionFloorPlan.dataHeaders).toContain(headerText);
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

      // get the content of all td tags marked with 'Floored' and 'Disbursement'.
      // this will effectively return the text inside the first column of the search result table.
      contentWithMarker('Floored', 'Disbursement').then(function (contents) {
        expect(flooringDates.count()).toEqual(contents.length);
        expect(disbursementDates.count()).toEqual(contents.length);
        // iterate over each flooring dates column.
        flooringDates.each(function (flooringDate) {
          // get the text value of the flooring date
          flooringDate.getText().then(function (text) {
            expect(textInContents(contents, text)).toBeTruthy();
          });
        });
        disbursementDates.each(function (disbursementDate) {
          disbursementDate.getText().then(function (text) {
            expect(textInContents(contents, text)).toBeTruthy();
          });
        });
      });
    });

    xit('Should contains vehicle description and vin for the description column of the search results.', function () {
      var vinColumn = 'item.UnitVIN';
      var descriptionColumn = 'item.Description';

      var vins = dataFromRepeater(repeater, vinColumn);
      var descriptions = dataFromRepeater(repeater, descriptionColumn);

      contentWithMarker('VIN').then(function (contents) {
        expect(vins.count()).toEqual(contents.length);
        expect(descriptions.count()).toEqual(contents.length);
        vins.each(function (vin) {
          vin.getText().then(function (text) {
            expect(textInContents(contents, text)).toBeTruthy();
          });
        });
        descriptions.each(function (description) {
          description.getText().then(function (text) {
            expect(textInContents(contents, text)).toBeTruthy();
          });
        });
      });
    });

    it('Should contains title owner and seller have title for the title location column.', function () {
      var titleLocationColumn = 'item.TitleLocation';
      var titleLocations = dataFromRepeater(repeater, titleLocationColumn);
      contentWithMarker('Buyer').then(function (contents) {
        expect(titleLocations.count()).toEqual(contents.length);
        titleLocations.each(function (titleLocation) {
          titleLocation.getText().then(function (text) {
            expect(textInContents(contents, text)).toBeTruthy();
          });
        });
        expect(textInContents(contents, 'I Have the Title')).toBeTruthy();
      });
    });

    it('Should display icon to view title when scanned title is available on the title column.', function () {
      contentWithMarker('btn-square').then(function (contents) {
        // TODO: this test is very data specific as the icon to view title will displayed depending on data.
        expect(contents.length).toBeGreaterThan(0);
      });
    });
  });
});
