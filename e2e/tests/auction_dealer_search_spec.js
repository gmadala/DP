'use strict';

var AuctionHelperObject = require('../framework/auction_helper_object');
var AuctionDealerSearchObject = require('../framework/auction_dealer_search_object');

var auctionHelper = new AuctionHelperObject();
var auctionDealerSearch = new AuctionDealerSearchObject();
auctionHelper.describe('WMT-70', function () {
  describe('Auction Portal - Dealer Search Content', function () {

    beforeEach(function () {
      auctionDealerSearch.openPage();
      auctionDealerSearch.waitForPage();
    });

    it('Dealer Number Search includes NextGear Capital Dealer Number search.', function () {
      var dealerNumber = '12345';
      expect(auctionDealerSearch.dealerNumberField.isDisplayed()).toBeTruthy();
      expect(auctionDealerSearch.getDealerNumber()).not.toEqual(dealerNumber);
      auctionDealerSearch.setDealerNumber(dealerNumber);
      expect(auctionDealerSearch.getDealerNumber()).toEqual(dealerNumber);
      auctionDealerSearch.getDealerNumberSearchButton().then(function (dealerNumberSearchButton) {
        expect(dealerNumberSearchButton.isDisplayed()).toBeTruthy();
      });
    });

    it('Dealer Number Search includes Auction Access Number search.', function () {
      var accessNumber = '12345';
      expect(auctionDealerSearch.accessNumberField.isDisplayed()).toBeTruthy();
      expect(auctionDealerSearch.getAccessNumber()).not.toEqual(accessNumber);
      auctionDealerSearch.setAccessNumber(accessNumber);
      expect(auctionDealerSearch.getAccessNumber()).toEqual(accessNumber);
      auctionDealerSearch.getAuctionAccessSearchButton().then(function (auctionAccessSearchButton) {
        expect(auctionAccessSearchButton.isDisplayed()).toBeTruthy();
      });
    });

    it('Dealer Name Search includes the following fields:, Dealer Name, City, and State.', function () {
      expect(auctionDealerSearch.dealerNameField.isDisplayed()).toBeTruthy();
      expect(auctionDealerSearch.dealerCityField.isDisplayed()).toBeTruthy();
      expect(auctionDealerSearch.dealerStateField.isDisplayed()).toBeTruthy();
      expect(auctionDealerSearch.searchDealerButton.isDisplayed()).toBeTruthy();

      var dealerName = 'Example Dealer Name';
      expect(auctionDealerSearch.getDealerName()).not.toEqual(dealerName);
      auctionDealerSearch.setDealerName(dealerName);
      expect(auctionDealerSearch.getDealerName()).toEqual(dealerName);

      var dealerCity = 'Example City Name';
      expect(auctionDealerSearch.getCity()).not.toEqual(dealerCity);
      auctionDealerSearch.setCity(dealerCity);
      expect(auctionDealerSearch.getCity()).toEqual(dealerCity);

      var dealerState = 'Indiana';
      expect(auctionDealerSearch.getState()).not.toEqual(dealerState);
      auctionDealerSearch.setState(dealerState);
      expect(auctionDealerSearch.getState()).toEqual(dealerState);
    });
  });
});
