'use strict';

var DatePickerObject = require('../../framework/datepicker_page_object');
var AuctionHelperObject = require('../../framework/auction_helper_object');
var AuctionReportsObject = require('../../framework/auction_reports_object');

var datePickerObject = new DatePickerObject();
var auctionHelper = new AuctionHelperObject();
var auctionReports = new AuctionReportsObject();

auctionHelper.describe('WMT-78', function () {
  describe('Auction Portal – View A Report Content', function () {
    beforeEach(function () {
      auctionHelper.openPageAndWait(auctionReports.url, true, false);
    });

    var repeater = 'doc in documents';
    var unformattedDataFromRepeater = function (repeater, column) {
      // this will return a promise with an array containing all element for the repeater's column.
      // the different being the data returned by this function will be the raw repeater data (without the filter).
      // example:
      // parameter passed column: item.UnitVIN will return promise with array of all VIN displayed.
      return browser.element.all(by.repeater(repeater)).map(function (element) {
        return element.evaluate(column);
      });
    };

    var textInArray = function (array, text) {
      // check if one of the 'contents' array element contains 'text'
      var found = false;
      array.forEach(function (element) {
        if (text.toLowerCase().indexOf(element.toLowerCase()) > -1) {
          found = true;
        }
      });
      return found;
    };

    it('Current Reports contains Credit Availability Query History report and Receivable Detail report.', function () {
      var urlColumn = 'doc.url';
      var titleColumn = 'doc.title';

      var urlPromise = unformattedDataFromRepeater(repeater, urlColumn);
      var titlePromise = unformattedDataFromRepeater(repeater, titleColumn);

      var anchors = auctionReports.currentReport.all(by.css('a'));
      anchors.each(function (anchor) {
        anchor.getAttribute('href').then(function (href) {
          urlPromise.then(function (urlArray) {
            var encoded = urlArray.map(function (element) {
              return element.replace(' ', '%20');
            });
            // this is very brittle as the url might have some special characters in it
            expect(textInArray(encoded, href)).toBeTruthy();
          });
        });
        anchor.getText().then(function (text) {
          titlePromise.then(function (titleArray) {
            expect(textInArray(titleArray, text)).toBeTruthy();
          });
        });
      });
    });

    it('Historical Reports contains a Date selector and View Report button.', function () {
      var date = '07/23/2005';
      expect(auctionReports.disbursementDate.isDisplayed()).toBeTruthy();
      auctionReports.clickDisbursementDate();
      expect(datePickerObject.datepicker.isDisplayed()).toBeTruthy();
      datePickerObject.setDate(23, 'Jul', 2005);
      expect(auctionReports.getDisbursementDate()).toEqual(date);
      auctionReports.subsidiaries.count().then(function (count) {
        if (count > 1) {
          expect(auctionReports.subsidiariesSelection.isDisplayed()).toBeTruthy();
        }
      });
      expect(auctionReports.viewReportButton.isDisplayed()).toBeTruthy();
    });
  });
});
