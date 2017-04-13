'use strict';

function AuctionFloorVehiclePage() {

    /**
     * $() is equivalent to browser.elelment() or element()
     * $$() is equivalent to browser.elements() or elements()
     * */

    // Locators
    this.elBankAccounts = $$('#inputDisburseAcct option');
}

module.exports = AuctionFloorVehiclePage;
