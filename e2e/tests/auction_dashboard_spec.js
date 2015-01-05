'use strict';

var AuctionDashboardObject = require('../framework/auction_dashboard_object');
var AuctionHelperObject = require('../framework/auction_helper_object');

var auctionDashboardObject = new AuctionDashboardObject();
var auctionHelperObject = new AuctionHelperObject();
auctionHelperObject.describe('WMT-62', function () {
  describe('Auction Portal Dashboard navigation options', function () {
    beforeEach(function () {
      auctionDashboardObject.openPage();
      auctionDashboardObject.waitForPage();
    });

    it('Previous Disbursements navigates to View A Report', function () {
      expect(browser.driver.getCurrentUrl()).toContain(auctionDashboardObject.url);
      auctionDashboardObject.previousDisbursementsLink.click();
      expect(browser.driver.getCurrentUrl()).not.toContain(auctionDashboardObject.url);
    });
  });
});

auctionHelperObject.describe('WMT-69', function () {
  describe('Auction Portal - Dashboard Content', function () {
    beforeEach(function () {
      auctionDashboardObject.openPage();
      auctionDashboardObject.waitForPage();
    });

    var dashboardHeader;
    it('Disbursements Groups includes count and dollar amount.', function () {
      dashboardHeader = 'Disbursement Groups';
      auctionDashboardObject.getDashboardContent(dashboardHeader).then(function (dashboardContent) {
        expect(dashboardContent.all(by.css('li')).count()).toEqual(3);
        dashboardContent.getText().then(function (dashboardText) {
          expect(dashboardText).toContain('Paid Awaiting Title');
          dashboardText = dashboardText.replace('Paid Awaiting Title', '');
          expect(dashboardText).toContain('Paid');
          expect(dashboardText).toContain('Awaiting Disbursement');
        });
      });
      // make sure the following date is returned by server.
      expect(auctionDashboardObject.paidAwaitingTitle).toBeDefined();
      expect(auctionDashboardObject.paidAwaitingTitleTotal).toBeDefined();
      expect(auctionDashboardObject.paidDisbursements).toBeDefined();
      expect(auctionDashboardObject.paidDisbursementTotal).toBeDefined();
      expect(auctionDashboardObject.pendingDisbursements).toBeDefined();
      expect(auctionDashboardObject.pendingDisbursementTotal).toBeDefined();
    });

    it('Floor Plan includes count and dollar amount.', function () {
      dashboardHeader = 'Floor Plan';
      auctionDashboardObject.getDashboardContent(dashboardHeader).then(function (dashboardContent) {
        expect(dashboardContent.all(by.css('li')).count()).toEqual(5);
        dashboardContent.getText().then(function (dashboardText) {
          expect(dashboardText).toContain('Approved');
          expect(dashboardText).toContain('Awaiting Titles 0-15 Days');
          expect(dashboardText).toContain('Awaiting Titles 16-30 Days');
          expect(dashboardText).toContain('Awaiting Titles 30+ Days');
          expect(dashboardText).toContain('Pending');
        });
      });
      // make sure the following date is returned by server.
      expect(auctionDashboardObject.approvedFloorplans).toBeDefined();
      expect(auctionDashboardObject.approvedFloorplanAmount).toBeDefined();
      expect(auctionDashboardObject.awaitingTitleZeroToFifteenDays).toBeDefined();
      expect(auctionDashboardObject.awaitingTitleZeroToFifteenDaysAmount).toBeDefined();
      expect(auctionDashboardObject.awaitingTitleSixteenToThirtyDays).toBeDefined();
      expect(auctionDashboardObject.awaitingTitleSixteenToThirtyDaysAmount).toBeDefined();
      expect(auctionDashboardObject.awaitingTitleOverThirtyDays).toBeDefined();
      expect(auctionDashboardObject.awaitingTitleOverThirtyDaysAmount).toBeDefined();
      expect(auctionDashboardObject.pendingFloorplans).toBeDefined();
      expect(auctionDashboardObject.pendingFloorplansAmount).toBeDefined();
    });

    it('Recent Disbursements includes a table with columns for Date, No, and Amount.', function () {
      dashboardHeader = 'Recent Disbursements';
      // there should only be 3 column in the table
      auctionDashboardObject.getDashboardContent(dashboardHeader).then(function (dashboardContent) {
        var elements = dashboardContent.all(by.css('th'));
        expect(elements.count()).toEqual(3);
        expect(elements.get(0).getText()).toEqual('Date');
        expect(elements.get(1).getText()).toEqual('No.');
        expect(elements.get(2).getText()).toEqual('Amount');
      });
      // check the columns in the data returned by server
      expect(auctionDashboardObject.disbursements).toBeDefined();
      auctionDashboardObject.disbursements.count().then(function (count) {
        // if the disbursements have element, then it should contain the date, no and amount
        if (count > 0) {
          expect(auctionDashboardObject.disbursementsDate).toBeDefined();
          expect(auctionDashboardObject.disbursementsNo).toBeDefined();
          expect(auctionDashboardObject.disbursementsAmount).toBeDefined();
        }
      });
    });

    it('Volume of Past NextGear Capital Floorplans includes a selector, which defaults to Year.', function () {
      // expect the default to be year
      expect(auctionHelperObject.hasClass(auctionDashboardObject.slider, 'active-left')).toBeTruthy();
      expect(auctionDashboardObject.buttonYear.isDisplayed()).toBeTruthy();
      expect(auctionDashboardObject.buttonMonth.isDisplayed()).toBeTruthy();
      expect(auctionDashboardObject.buttonWeek.isDisplayed()).toBeTruthy();
    });

    it('Volume of Past NextGear Capital Floorplans includes a graph with the data selected based on the selector.', function () {
      expect(auctionDashboardObject.chartObject.isDisplayed()).toBeTruthy();
      expect(auctionDashboardObject.chartObjectAxis.getText()).toEqual('# of Floored Vehicles');
      expect(auctionDashboardObject.chartObjectTitle.getText()).toEqual('Volume of Past NextGear Capital Floorplans');
      auctionDashboardObject.getXAxisLabel().then(function (axisLabel) {
        var xAxisLabels = axisLabel.all(by.css('tspan'));
        xAxisLabels.each(function (xAxisLabel) {
          // expect the axis to match something like "Jan '14"
          expect(xAxisLabel.getText()).toMatch(/[A-Z][a-z]{2}\s+'\d{2}/);
        });
      });
    });

  });
});
