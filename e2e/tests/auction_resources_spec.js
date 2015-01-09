'use strict';

var AuctionHelperObject = require('../framework/auction_helper_object');
var AuctionResourcesObject = require('../framework/auction_resources_object');

var auctionHelper = new AuctionHelperObject();
var auctionResources = new AuctionResourcesObject();

auctionHelper.describe('WMT-78', function() {
  describe('Auction Portal – View A Report Content', function() {
    beforeEach(function() {
      auctionResources.openPage();
      auctionResources.waitForPage();
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
        if (text.toLowerCase().indexOf(element.toLowerCase()) !== -1) {
          found = true;
        }
      });
      return found;
    };

    it('Current Reports contains Credit Availability Query History report and Receivable Detail report.', function() {
      expect(auctionResources.infoBlockIcon.isDisplayed()).toBeTruthy();
      expect(auctionResources.infoBlockText.isDisplayed()).toBeTruthy();

      var urlColumn = 'doc.url';
      var titleColumn = 'doc.title';

      var urlPromise = unformattedDataFromRepeater(repeater, urlColumn);
      var titlePromise = unformattedDataFromRepeater(repeater, titleColumn);

      var anchors = auctionResources.documents.all(by.css('a'));
      anchors.each(function(anchor) {
        anchor.getAttribute('href').then(function(href) {
          urlPromise.then(function(urlArray) {
            var encoded = urlArray.map(function(element) {
              return element.replace(' ', '%20');
            });
            // this is very brittle as the url might have some special characters in it
            expect(textInArray(encoded, href)).toBeTruthy();
          });
        });
        anchor.getText().then(function(text) {
          titlePromise.then(function(titleArray) {
            expect(textInArray(titleArray, text)).toBeTruthy();
          });
        });
      });
    });
  });
});
