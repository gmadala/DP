'use strict';

function AuctionDashBoardObjects() {

    /**
     * $() is equivalent to browser.elelment() or element()
     * $$() is equivalent to browser.elements() or elements()
     * */

    // Locators
    this.elAuctionDashboardPage = $$('#AuctionDashboardPage').get(1);
    this.elFloorPlanChart = $('.chart-obj');
    this.elFirstDisbursement = $$('.table-value a').first();
    this.elMenuDealerSearch = $('a[href="#/act/dealersearch"]');

    // Dom Events
    this.clickFirstDisbursement = () => {
        this.elFirstDisbursement.click();
    };

    this.clickMenuDealerSearch = () => {
        this.elMenuDealerSearch.click();
    };
}

module.exports = AuctionDashBoardObjects;
