'use strict';

var AuctionDashboardObject = require('../framework/auction_dashboard_object');
var AuctionHelperObject = require('../framework/auction_helper_object');

var auctionDashboardObject = new AuctionDashboardObject();
var auctionHelperObject = new AuctionHelperObject();
auctionHelperObject.describe('WMT-62', function() {
  describe('Auction Portal Dashboard navigation options', function() {
    beforeEach(function() {
      auctionDashboardObject.openPage();
      auctionDashboardObject.waitForPage();
    });

    it('Previous Disbursements navigates to View A Report', function() {
      expect(browser.driver.getCurrentUrl()).toContain(auctionDashboardObject.url);
      auctionDashboardObject.previousDisbursementsLink.click();
      expect(browser.driver.getCurrentUrl()).not.toContain(auctionDashboardObject.url);
    });
  });
});
