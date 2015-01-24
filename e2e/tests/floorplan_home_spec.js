/**
 * Created by gayathrimadala on 12/29/14.
 */
'use strict';

var HelperObject = require('../framework/helper_object');
var FloorPlanObject = require('../framework/floorplan_page_object.js');
var CredentialsObject = require('../framework/credentials_page_object.js');

var helper = new HelperObject();
var credPage = new CredentialsObject();
var floorPlanPage = new FloorPlanObject();

//Floor Plan Page
helper.describe('WMT-101', function () {
  describe('Dealer Portal Floor Plan Page', function () {

    beforeEach(function () {
      helper.openPageAndWait(floorPlanPage.floorPlanUrl, false, true);
    });

    it('should find a floor plan - search on VIN', function () {
      floorPlanPage.doSearchFloorPlan(credPage.findFloorPlanVIN);
      floorPlanPage.goToFloorPlanSearch();
    });
    it('should find a floor plan - search i/p fields', function () {
      expect(browser.getCurrentUrl()).toContain(floorPlanPage.floorPlanUrl);
      expect(floorPlanPage.floorPlanLinks.count()).toBeGreaterThan(0);
      floorPlanPage.goToFlooringStatus();
      floorPlanPage.doStartDate(credPage.floorPlanStartDate);
      floorPlanPage.doEndDate(credPage.floorPlanEndDate);
      //floorPlanPage.goToInvLocSelect();
    });
    it('should validate Floor Plan page object is accessing the correct fields.', function () {
      expect(floorPlanPage.searchFloorPlan.isDisplayed()).toBeTruthy();
      expect(floorPlanPage.getInventoryLocation()).toBeDefined();
      expect(floorPlanPage.invLocationsOptions.count()).toBeGreaterThan(2);
      floorPlanPage.getInventoryLocation().then(function (inventoryLocation) {
        expect(inventoryLocation.isDisplayed()).toBeTruthy();
      });
      expect(floorPlanPage.searchButton.isDisplayed()).toBeTruthy();
      expect(floorPlanPage.clearSearchButton.isDisplayed()).toBeTruthy();
    });
    it('should check for the Floor Plan Links', function () {
      expect(browser.getCurrentUrl()).toContain(floorPlanPage.floorPlanUrl);
      expect(floorPlanPage.floorPlanLinks.count()).toBeGreaterThan(0);
      expect(floorPlanPage.goToFloorPlanLinks()).toBeDefined();
      floorPlanPage.goToFloorPlanLinks().then(function (floorPlanLink) {
        floorPlanLink.click();
      });
    });
    //WMT-101 - Dealer Portal – Floor Plan content.
    it('Dealer Portal – Floor Plan content.', function () {
      expect(browser.getCurrentUrl()).toContain(floorPlanPage.floorPlanUrl);
      expect(floorPlanPage.findAFloor.isDisplayed()).toBeTruthy();
      expect(floorPlanPage.searchFloorPlan.isDisplayed()).toBeTruthy();
      expect(floorPlanPage.flooringStatus.isDisplayed()).toBeTruthy();
      expect(floorPlanPage.filterSelect.isDisplayed()).toBeTruthy();
      expect(floorPlanPage.filterSelectOptions.count()).toBe(5);
      expect(floorPlanPage.invLocationsOptions.count()).toBeGreaterThan(2);
    });

    it('should check for the inventory location dropdown count', function () {
      expect(browser.getCurrentUrl()).toContain(floorPlanPage.floorPlanUrl);
      floorPlanPage.invLocationsOptions.count().then(function (count) {
          if (count > 0) {
            expect(floorPlanPage.invLocationsOptions.isDisplayed()).toBeTruthy();
          }
          else if (count === 1) {
            expect(floorPlanPage.invLocationsOptions.isDisplayed()).toBeFalsy();
          }
        }
      );
    });

    it('should find a floor plan - search on VIN', function () {
      floorPlanPage.doSearchFloorPlan(credPage.findFloorPlanVIN);
      floorPlanPage.goToFloorPlanSearch();
      expect(floorPlanPage.floorPlanData).toBeDefined();
      floorPlanPage.floorPlanData.count().then(function (count) {
        // if the Title Release Request have element, then it should contain the Floored, Description, Purchased, Release Status, and Actions.
        if (count > 0) { // Correct VIN number
          expect(floorPlanPage.floored.isDisplayed()).toBeTruthy();
          expect(floorPlanPage.floorDescription.isDisplayed()).toBeTruthy();
          expect(floorPlanPage.floorStatus.isDisplayed()).toBeTruthy();
          expect(floorPlanPage.purchased.isDisplayed()).toBeTruthy();
          expect(floorPlanPage.seller.isDisplayed()).toBeTruthy();
          expect(floorPlanPage.lastPayment.isDisplayed()).toBeTruthy();
          expect(floorPlanPage.floorTitle.isDisplayed()).toBeTruthy();

          //columns data
          expect(floorPlanPage.flooredDays).toBeDefined();
          expect(floorPlanPage.floorDescriptionData).toBeDefined();
          expect(floorPlanPage.flooredStatusData).toBeDefined();
          expect(floorPlanPage.floorPurchasedData).toBeDefined();
          expect(floorPlanPage.floorSellerData).toBeDefined();
          expect(floorPlanPage.floorLastPaymentData).toBeDefined();
          expect(floorPlanPage.floorTitleData).toBeDefined();
        }
        else { // when the count is less than zero - incorrect VIN number
          expect(floorPlanPage.noResults.isDisplayed()).toBeTruthy();
        }
      });
    });

    var repeater = 'item in floorplanData.results';

    var formattedDataFromRepeater = function (repeater, column) {
      return browser.element.all(by.repeater(repeater).column(column));
    };

    var unformattedDataFromRepeater = function (repeater, column) {
      return browser.element.all(by.repeater(repeater)).map(function (element) {
        return element.evaluate(column);
      });
    };

    var textInContents = function (contents, text) {
      // check if one of the 'contents' array element contains 'text'
      var found = false;
      contents.forEach(function (content) {
        if (content.toLowerCase().indexOf(text.toLowerCase()) > -1) {
          found = true;
        }
      });
      return found;
    };

    var contentWithMarker = function () {
      var counter = 0;
      var contents = [];
      var parameters = arguments;
      var promise = protractor.promise.defer();
      floorPlanPage.floorplanDataRows.count().then(function (count) {
        floorPlanPage.floorplanDataRows.each(function (row) {
          var cells = row.all(by.css('td'));
          cells.each(function (cell) {
            cell.getInnerHtml().then(function (text) {
              var notFound = false;
              for (var i = 0; i < parameters.length; i++) {
                var argument = parameters[i].toString();
                if (text.indexOf(argument) <= -1) {
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

    it('Should contains all the correct headers for the search results.', function () {
      expect(floorPlanPage.floorplanDataHeaders.count()).toBe(7);
      // check if the header of the repeating elements is correct
      floorPlanPage.floorplanDataHeaders.each(function (floorplanDataHeader) {
        floorplanDataHeader.getText().then(function (headerText) {
          expect(floorPlanPage.dataHeaders).toContain(headerText);
        });
      });
      // check if the floor plan data column is visible or not.
      floorPlanPage.columnValues.forEach(function (columnName) {
        var column = formattedDataFromRepeater(repeater, columnName);
        column.each(function (columnData) {
          expect(columnData.isDisplayed()).toBeTruthy();
        });
      });
    });

    it('Should contains floored date for the Floored column of the search results.', function () {
      var flooringDateColumn = 'item.FlooringDate';
      var flooringDates = formattedDataFromRepeater(repeater, flooringDateColumn);
      // get the content of all td tags marked with 'Floored' and 'Disbursement'.
      // this will effectively return the text inside the first column of the search result table.
      contentWithMarker('days').then(function (contents) {
        expect(flooringDates.count()).toEqual(contents.length);
        // iterate over each flooring dates column.
        flooringDates.each(function (flooringDate) {
          // get the text value of the flooring date
          flooringDate.getText().then(function (text) {
            expect(textInContents(contents, text)).toBeTruthy();
          });
        });
      });
    });

    it('Should contains vehicle description and vin for the description column of the search results.', function () {
      var vinColumn = 'item.UnitVIN';
      var stkColumn = 'item.StockNumber';
      var descriptionColumn = 'item.Description';
      var vinPromise = unformattedDataFromRepeater(repeater, vinColumn);
      var descPromise = unformattedDataFromRepeater(repeater, descriptionColumn);
      var stkPromise = unformattedDataFromRepeater(repeater, stkColumn);
      contentWithMarker('VIN').then(function (contents) {
        vinPromise.then(function (vinData) {
          expect(vinData.length).toEqual(contents.length);
          vinData.forEach(function (vin) {
            expect(textInContents(contents, vin)).toBeTruthy();
          });
        });
        contentWithMarker('STK').then(function (contents) {
          stkPromise.then(function (stkData) {
            expect(stkData.length).toEqual(contents.length);
            stkData.forEach(function (stk) {
              expect(stk).toBeTruthy();
            });
          });
          descPromise.then(function (descriptions) {
            expect(descriptions.length).toEqual(contents.length);
            descriptions.forEach(function (description) {
              expect(textInContents(contents, description)).toBeTruthy();
            });
          });
        });
      });
    });

    it('Should contains status for the  Status column of the search results.', function () {
      var statusColumn = 'item.FloorplanStatusName';
      var statusValues = formattedDataFromRepeater(repeater, statusColumn);
      // iterate over each Status column.
      statusValues.each(function (statusValue) {
        // get the text value of the status value
        statusValue.getText().then(function (text) {
          expect(text).toBeTruthy();
        });
      });
    });

    it('Should contains purchased date for the Purchased column of the search results.', function () {
      var purchasedColumn = 'item.UnitPurchaseDate';
      var purchasedValues = formattedDataFromRepeater(repeater, purchasedColumn);
      purchasedValues.each(function (purchasedValue) {
        // get the text value of the purchased value
        purchasedValue.getText().then(function (text) {
          expect(text).toBeTruthy();
        });
      });
    });

    it('Should contains seller for the Seller column of the search results.', function () {
      var sellerColumn = 'item.SellerName';
      var sellerValues = formattedDataFromRepeater(repeater, sellerColumn);
      // iterate over each Seller column.
      sellerValues.each(function (sellerValue) {
        // get the text value of the Seller value
        sellerValue.getText().then(function (text) {
          expect(text).toBeTruthy();
        });
      });
    });

    it('Should contains last payment date for the Last Payment column of the search results.', function () {
      var lastPaymentColumn = 'item.LastPaymentDate';
      var lastPaymentValues = formattedDataFromRepeater(repeater, lastPaymentColumn);
      //iterate over each Last Payment column.
      lastPaymentValues.each(function (lastPaymentValue) {
        // get the text value of the Last Payment value
        lastPaymentValue.getText().then(function (text) {
          expect(text).toBeTruthy();
        });
      });

    });

    it('Should display icon to view title when scanned title is available on the title column.', function () {
      var titleImageAvailable = 'item.TitleImageAvailable';
      var titleImageAvailableValues = unformattedDataFromRepeater(repeater, titleImageAvailable);
      contentWithMarker('btn-square').then(function (contents) {
        titleImageAvailableValues.then(function (values) {
          expect(values.length).toEqual(contents.length);
          for (var i = 0; i < contents.length; i++) {
            var content = contents[i];
            var available = values[i];
            if (available) {
              expect(content).toContain('btn-square');
            }
          }
        });
      });
    });

  });
});
