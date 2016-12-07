'use strict';

function Analytics() {

    //Locators
    this.elBusinessSummaryContainer = browser.element.all(by.css("h2.well-title")).get(0);
    this.elAverageTurnContainer = browser.element.all(by.css("h2.well-title")).get(1);
    this.elStaleAgingVehiclesContainer = browser.element.all(by.css("h2.well-title")).get(2);
    this.elBestWorstMoversContainer = browser.element.all(by.css("h2.well-title")).get(3);
    this.elYourTop10AuctionsContainer = browser.element.all(by.css("h2.well-title")).get(4);
    this.elApprovedFloorPlans = browser.element.all(by.css("h3")).get(0);
    this.elPendingFloorPlans = browser.element.all(by.css("h3")).get(1);
    this.elCreditAndPayments = browser.element.all(by.css("h3")).get(2);
    this.elAverageTurnGraph = browser.element.all(by.css("rect.highcharts-background")).get(0);
    this.elBestMovers = browser.element(by.buttonText('Best Movers'));
    this.elWorstMovers = browser.element(by.buttonText('Worst Movers'));
    this.elViewAllAuction = browser.element(by.buttonText('View All Auctions'));
    this.elCloseWindow = browser.element(by.buttonText('Close Window'));
    this.elModalHeader = browser.element(by.css('h3.modal-header'));

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
    this.getPendingFloorPlans = function () {
        browser.sleep(browser.params.shortDelay);
        return this.elPendingFloorPlans.getText();
    };
    this.getCreditAndPayments = function () {
        browser.sleep(browser.params.shortDelay);
        return this.elCreditAndPayments.getText();
    };
    this.getModalHeader = function () {
        browser.sleep(browser.params.shortDelay);
        return this.elModalHeader.getText();
    };

    //Doers
    this.doBestMovers = function () {
        browser.sleep(browser.params.shortDelay);
        this.elBestMovers.click();
    };
    this.doWorstMovers = function () {
        browser.sleep(browser.params.shortDelay);
        this.elWorstMovers.click();
    };
    this.doViewAllAuction = function () {
        browser.sleep(browser.params.shortDelay);
        this.elViewAllAuction.click();
    };
    this.doModalCloseWindow = function () {
        browser.sleep(browser.params.shortDelay);
        this.elCloseWindow.click();
    };

}
module.exports.analytics = Analytics;
