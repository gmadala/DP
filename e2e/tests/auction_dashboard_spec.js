'use strict';

var AuctionDashboardObject = require('../framework/auction_dashboard_object');
var AuctionHelperObject = require('../framework/auction_helper_object');

var auctionDashboard = new AuctionDashboardObject();
var auctionHelper = new AuctionHelperObject();
auctionHelper.describe('WMT-62', function () {
  describe('Auction Portal Dashboard navigation options', function () {
    beforeEach(function () {
      auctionHelper.openPageAndWait(auctionDashboard.url, true, false);
    });

    it('Previous Disbursements navigates to View A Report', function () {
      expect(browser.driver.getCurrentUrl()).toContain(auctionDashboard.url);
      auctionDashboard.previousDisbursementsLink.click().then(function () {
        auctionHelper.waitForUrlToContains('act/reports');
        expect(browser.driver.getCurrentUrl()).not.toContain(auctionDashboard.url);
      });
    });
  });
});

auctionHelper.describe('WMT-69', function () {
  describe('Auction Portal - Dashboard Content', function () {
    beforeEach(function () {
      auctionHelper.openPageAndWait(auctionDashboard.url, true, false);
    });

    var dashboardHeader;
    it('Disbursements Groups includes count and dollar amount.', function () {
      dashboardHeader = 'Disbursement Groups';
      auctionDashboard.getDashboardContent(dashboardHeader).then(function (dashboardContent) {
        expect(dashboardContent.all(by.css('li')).count()).toEqual(3);
        dashboardContent.getText().then(function (dashboardText) {
          expect(dashboardText).toContain('Paid Awaiting Title');
          dashboardText = dashboardText.replace('Paid Awaiting Title', '');
          expect(dashboardText).toContain('Paid');
          expect(dashboardText).toContain('Awaiting Disbursement');
        });
      });
      // make sure the following date is returned by server.
      expect(auctionDashboard.paidAwaitingTitle.getText()).not.toEqual('');
      expect(auctionDashboard.paidAwaitingTitleTotal.getText()).not.toEqual('');
      expect(auctionDashboard.paidDisbursements.getText()).not.toEqual('');
      expect(auctionDashboard.paidDisbursementTotal.getText()).not.toEqual('');
      expect(auctionDashboard.pendingDisbursements.getText()).not.toEqual('');
      expect(auctionDashboard.pendingDisbursementTotal.getText()).not.toEqual('');
    });

    it('Floor Plan includes count and dollar amount.', function () {
      dashboardHeader = 'Floor Plan';
      auctionDashboard.getDashboardContent(dashboardHeader).then(function (dashboardContent) {
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
      expect(auctionDashboard.approvedFloorplans.getText()).not.toEqual('');
      expect(auctionDashboard.approvedFloorplanAmount.getText()).not.toEqual('');
      expect(auctionDashboard.awaitingTitleZeroToFifteenDays.getText()).not.toEqual('');
      expect(auctionDashboard.awaitingTitleZeroToFifteenDaysAmount.getText()).not.toEqual('');
      expect(auctionDashboard.awaitingTitleSixteenToThirtyDays.getText()).not.toEqual('');
      expect(auctionDashboard.awaitingTitleSixteenToThirtyDaysAmount.getText()).not.toEqual('');
      expect(auctionDashboard.awaitingTitleOverThirtyDays.getText()).not.toEqual('');
      expect(auctionDashboard.awaitingTitleOverThirtyDaysAmount.getText()).not.toEqual('');
      expect(auctionDashboard.pendingFloorplans.getText()).not.toEqual('');
      expect(auctionDashboard.pendingFloorplansAmount.getText()).not.toEqual('');
    });

    it('Recent Disbursements includes a table with columns for Date, No, and Amount.', function () {
      dashboardHeader = 'Recent Disbursements';
      // there should only be 3 column in the table
      auctionDashboard.getDashboardContent(dashboardHeader).then(function (dashboardContent) {
        var elements = dashboardContent.all(by.css('th'));
        expect(elements.count()).toEqual(3);
        expect(elements.get(0).getText()).toEqual('Date');
        expect(elements.get(1).getText()).toEqual('No.');
        expect(elements.get(2).getText()).toEqual('Amount');
      });
      // check the columns in the data returned by server
      expect(auctionDashboard.disbursements).toBeDefined();
      auctionDashboard.disbursements.count().then(function (count) {
        // if the disbursements have element, then it should contain the date, no and amount
        if (count > 0) {
          auctionDashboard.disbursementsDate.each(function (disbursementDate) {
            expect(disbursementDate.getText()).not.toEqual('');
          });
          auctionDashboard.disbursementsNo.each(function (disbursementNo) {
            expect(disbursementNo.getText()).not.toEqual('');
          });
          auctionDashboard.disbursementsAmount.each(function (disbursementAmount) {
            expect(disbursementAmount.getText()).not.toEqual('');
          });
        }
      });
    });

    it('Volume of Past NextGear Capital Floorplans includes a selector, which defaults to Year.', function () {
      // expect the default to be year
      expect(auctionHelper.hasClass(auctionDashboard.slider, 'active-left')).toBeTruthy();
      expect(auctionDashboard.buttonYear.isDisplayed()).toBeTruthy();
      expect(auctionDashboard.buttonMonth.isDisplayed()).toBeTruthy();
      expect(auctionDashboard.buttonWeek.isDisplayed()).toBeTruthy();
    });

    it('Volume of Past NextGear Capital Floorplans includes a graph with the data selected based on the selector.', function () {
      expect(auctionDashboard.chartObject.isDisplayed()).toBeTruthy();
      expect(auctionDashboard.chartObjectAxis.getText()).toEqual('# of Floored Vehicles');
      expect(auctionDashboard.chartObjectTitle.getText()).toEqual('Volume of Past NextGear Capital Floorplans');
      auctionDashboard.getXAxisLabel().then(function (axisLabel) {
        var xAxisLabels = axisLabel.all(by.css('tspan'));
        xAxisLabels.each(function (xAxisLabel) {
          // expect the axis to match something like "Jan '14"
          expect(xAxisLabel.getText()).toMatch(/[A-Z][a-z]{2}\s+'\d{2}/);
        });
      });
    });

  });
});
