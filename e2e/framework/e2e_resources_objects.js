'use strict';

function Resources() {

    this.elResourcesLink = element(by.className('link_documents'));
    this.elRatesAndFees = element(by.linkText('Rates and Fees'));
    this.elDealerFunding = element(by.linkText('Dealer Funding Checklist'));
    this.elWelcomePacket = element(by.linkText('Welcome Packet'));
    this.elTitleManagement = element(by.linkText('Title Management Frequently Asked Questions'));
    this.elInstructionsBuyers = element(by.linkText('Instructions for Buyers'));
    this.elWelcomeLetter = element(by.linkText('Welcome Letter'));
    this.elGuidelines = element(by.linkText('Guidelines'));
    this.elInformationSheets = element(by.linkText('Information Sheet'));
    this.elClaimForm = element(by.linkText('Claim Form'));
    this.elMyNextGearMobileIOS = element(by.linkText('iOS Installation Guide'));
    this.elMyNextGearMobileAndroid = element(by.linkText('Android Installation Guide'));

    //Doers
    this.doResources = function () {
        browser.waitForAngular();
        this.elResourcesLink.click();
        browser.sleep(browser.params.mediumDelay);
    };
    this.doRatesAndFees = function () {
        browser.waitForAngular();
        this.elRatesAndFees.click();
        browser.sleep(browser.params.mediumDelay);
    };
    this.doDealerFunding = function () {
        browser.waitForAngular();
        this.elDealerFunding.click();
        browser.sleep(browser.params.mediumDelay);
    };
    this.doWelcomePacket = function () {
        browser.waitForAngular();
        this.elWelcomePacket.click();
        browser.sleep(browser.params.mediumDelay);
    };
    this.doTitleManagement = function () {
        browser.waitForAngular();
        this.elTitleManagement.click();
        browser.sleep(browser.params.mediumDelay);
    };
    this.doInstructionsForBuyers = function () {
        browser.waitForAngular();
        this.elInstructionsBuyers.click();
        browser.sleep(browser.params.mediumDelay);
    };
    this.doWelcomeLetter = function () {
        browser.waitForAngular();
        this.elWelcomeLetter.click();
        browser.sleep(browser.params.mediumDelay);
    };
    this.doGuidelines = function () {
        browser.waitForAngular();
        this.elGuidelines.click();
        browser.sleep(browser.params.mediumDelay);
    };
    this.doInformationSheet = function () {
        browser.waitForAngular();
        this.elInformationSheets.click();
        browser.sleep(browser.params.mediumDelay);
    };
    this.doClaimForm = function () {
        browser.waitForAngular();
        this.elClaimForm.click();
        browser.sleep(browser.params.mediumDelay);
    };
    this.doMobileIOS = function () {
        browser.waitForAngular();
        this.elMyNextGearMobileIOS.click();
        browser.sleep(browser.params.mediumDelay);
    };
    this.doMobileAndroid = function () {
        browser.waitForAngular();
        this.elMyNextGearMobileAndroid.click();
        browser.sleep(browser.params.mediumDelay);
    };
}
module.exports.resources = Resources;
