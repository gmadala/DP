'use strict';

var AuctionHelperObject = require('../framework/auction_helper_object');
var AuctionDealerSearchObject = require('../framework/auction_dealer_search_object');

var auctionHelper = new AuctionHelperObject();
var auctionDealerSearch = new AuctionDealerSearchObject();
auctionHelper.describe('WMT-70', function() {
  describe('Auction Portal - Dealer Search Content', function() {

    beforeEach(function() {
      auctionDealerSearch.openPage();
      auctionDealerSearch.waitForPage();
    });

    it('Dealer Number Search includes NextGear Capital Dealer Number search.', function() {
      expect(auctionDealerSearch.dealerNumberField.isDisplayed()).toBeTruthy();
      auctionDealerSearch.getDealerNumberSearchButton().then(function(dealerNumberSearchButton) {
        expect(dealerNumberSearchButton.isDisplayed()).toBeTruthy();
      });
    });

    it('Dealer Number Search includes Auction Access Number search.', function() {
      expect(auctionDealerSearch.accessNumberField.isDisplayed()).toBeTruthy();
      auctionDealerSearch.getAuctionAccessSearchButton().then(function(auctionAccessSearchButton) {
        expect(auctionAccessSearchButton.isDisplayed()).toBeTruthy();
      });
    });

    it('Dealer Name Search includes the following fields:, Dealer Name, City, and State.', function() {
      expect(auctionDealerSearch.dealerNameField.isDisplayed()).toBeTruthy();
      expect(auctionDealerSearch.dealerCityField.isDisplayed()).toBeTruthy();
      expect(auctionDealerSearch.dealerStateField.isDisplayed()).toBeTruthy();
      expect(auctionDealerSearch.searchDealerButton.isDisplayed()).toBeTruthy();
    });
  });
});
