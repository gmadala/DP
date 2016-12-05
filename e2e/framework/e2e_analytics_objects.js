'use strict';

function Analytics() {

    //Locators
    this.elBusinessSummaryContainer = browser.element.all(by.css("h2.well-title")).get(0);
    this.elAverageTurnContainer = browser.element.all(by.css("h2.well-title")).get(1);
    this.elStaleAgingVehiclesContainer = browser.element.all(by.css("h2.well-title")).get(2);
    this.elBestWorstMoversContainer = browser.element.all(by.css("h2.well-title")).get(3);
    this.elYourTop10AuctionsContainer = browser.element.all(by.css("h2.well-title")).get(4);
    this.elApprovedFloorPlans = browser.element.all(by.css("h3")).get(0);

    //Getters
    this.getBusinessSummaryContainer = function () {
        browser.sleep(browser.params.shortDelay);
        return this.elBusinessSummaryContainer.getText();
    };
    this.getAverageTurnContainer = function () {
        browser.sleep(browser.params.shortDelay);
        return this.elAverageTurnContainer.getText();
    };
    this.getBestWorstMoversContainer = function () {
        browser.sleep(browser.params.shortDelay);
        return this.elBestWorstMoversContainer.getText();
    };
    this.getStaleAgingVehiclesContainer = function () {
        browser.sleep(browser.params.shortDelay);
        return this.elStaleAgingVehiclesContainer.getText();
    };
    this.getYourTop10AuctionsContainer = function () {
        browser.sleep(browser.params.shortDelay);
        return this.elYourTop10AuctionsContainer.getText();
    };
    this.getApprovedFloorPlans = function () {
        browser.sleep(browser.params.shortDelay);
        return this.elApprovedFloorPlans.getText();
    };

}
module.exports.analytics = Analytics;
