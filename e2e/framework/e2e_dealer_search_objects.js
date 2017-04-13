'use strict';

function DealerSearchObjects() {

    /**
     * $() is equivalent to browser.elelment() or element()
     * $$() is equivalent to browser.elements() or elements()
     * */

    // Locators
    this.elSearchBox = $('#search');
    this.elSearchBtn = $('#floorPlanSearch');
    this.elDealerSearchFirstResult = $$('tbody tr').first();
    this.elMenuFloorVehicle = $('a[href="#/act/bulkflooring"]');

    // Dom Events
    this.clearSearchValue = () => {
        this.elSearchBox.clear();
    };

    this.setSearchValue = (searchText) => {
        this.clearSearchValue();
        this.elSearchBox.sendKeys(searchText);
    };

    this.doSearch = () => {
        this.elSearchBtn.click();

        browser.sleep(browser.params.longDelay);
    };

    this.clickMenuFloorVehicle = () => {
        this.elMenuFloorVehicle.click();
    };
}

module.exports = DealerSearchObjects;
