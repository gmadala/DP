'use strict';

var AuctionHelperObject = require('../framework/auction_helper_object');
var AuctionNavObject = require('../framework/auction_navigation_object');

var auctionHelperObject = new AuctionHelperObject();
var auctionNavObject = new AuctionNavObject();

auctionHelperObject.describe('WMT-61', function() {
  describe('Auction Portal High Level Navigation Options', function() {

    it('Successful login navigates to Dashboard', function() {
      expect(browser.driver.getCurrentUrl()).toContain('act/home');
    });

    it('Dashboard navigation option navigates to Dashboard', function() {
      expect(auctionNavObject.navLinks.count()).toEqual(6);
      auctionNavObject.getNavLink('Dashboard').then(function(navLink) {
        navLink.click();
      });
      expect(browser.driver.getCurrentUrl()).toContain('act/home');
    });

    it('Dealer Search navigation option navigates to Dealer Search', function() {
      expect(auctionNavObject.navLinks.count()).toEqual(6);
      auctionNavObject.getNavLink('Dealer Search').then(function(navLink) {
        navLink.click();
      });
      expect(browser.driver.getCurrentUrl()).toContain('act/dealersearch');
    });

    it('Dealer Search navigation option navigates to Dealer Search', function() {
      expect(auctionNavObject.navLinks.count()).toEqual(6);
      auctionNavObject.getNavLink('Floor a Vehicle').then(function(navLink) {
        navLink.click();
      });
      expect(browser.driver.getCurrentUrl()).toContain('act/bulkflooring');
    });

    it('Dealer Search navigation option navigates to Dealer Search', function() {
      expect(auctionNavObject.navLinks.count()).toEqual(6);
      auctionNavObject.getNavLink('Seller Floor Plan Search').then(function(navLink) {
        navLink.click();
      });
      expect(browser.driver.getCurrentUrl()).toContain('act/sellerfloorplan');
    });

    it('Dealer Search navigation option navigates to Dealer Search', function() {
      expect(auctionNavObject.navLinks.count()).toEqual(6);
      auctionNavObject.getNavLink('View a Report').then(function(navLink) {
        navLink.click();
      });
      expect(browser.driver.getCurrentUrl()).toContain('act/reports');
    });

    it('Dealer Search navigation option navigates to Dealer Search', function() {
      expect(auctionNavObject.navLinks.count()).toEqual(6);
      auctionNavObject.getNavLink('Resources').then(function(navLink) {
        navLink.click();
      });
      expect(browser.driver.getCurrentUrl()).toContain('act/documents');
    });
  });
});
