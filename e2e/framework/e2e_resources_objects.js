'use strict';

function Resources() {

  var delay = 1000;

  this.elResourcesLink = element(by.className('link_documents'));
  this.elRatesAndFees = element(by.id('ratesandfees'));
  this.elDealerFunding = element(by.linkText('Dealer Funding Checklist'));
  this.elWelcomePacket = element(by.linkText('Welcome Packet'));
  this.elTitleManagement = element(by.linkText('Title Management Frequently Asked Questions'));
  this.elInstructionsBuyers = element(by.linkText('Instructions for Buyers'));
  this.elWelcomeLetter = element(by.linkText('Welcome Letter'));
  this.elGuidelines = element(by.linkText('Guidelines'));
  this.elInformationSheets = element(by.linkText('Information Sheet'));
  this.elClaimForm = element(by.linkText('Claim Form'));
  this.elMyNextGearMobileIOS = element(by.linkText('Download myNextGear mobile iOS'));
  this.elMyNextGearMobileAndroid = element(by.linkText('Download myNextGear mobile Android'));

  //Doers
  this.doResources = function() {
    browser.waitForAngular();
    this.elResourcesLink.click();
    browser.sleep(delay);
  };
  this.doRatesAndFees = function() {
    browser.waitForAngular();
    this.elRatesAndFees.click();
    browser.sleep(delay);
  };
  this.doDealerFunding = function() {
    browser.waitForAngular();
    this.elDealerFunding.click();
    browser.sleep(delay);
  };
  this.doWelcomePacket = function() {
    browser.waitForAngular();
    this.elWelcomePacket.click();
    browser.sleep(delay);
  };
  this.doTitleManagement = function() {
    browser.waitForAngular();
    this.elTitleManagement.click();
    browser.sleep(delay);
  };
  this.doInstructionsForBuyers = function() {
    browser.waitForAngular();
    this.elInstructionsBuyers.click();
    browser.sleep(delay);
  };
  this.doWelcomeLetter = function() {
    browser.waitForAngular();
    this.elWelcomeLetter.click();
    browser.sleep(delay);
  };
  this.doGuidelines = function() {
    browser.waitForAngular();
    this.elGuidelines.click();
    browser.sleep(delay);
  };
  this.doInformationSheet = function() {
    browser.waitForAngular();
    this.elInformationSheets.click();
    browser.sleep(delay);
  };
  this.doClaimForm = function() {
    browser.waitForAngular();
    this.elClaimForm.click();
    browser.sleep(delay);
  };
  this.doMobileIOS = function() {
    browser.waitForAngular();
    this.elMyNextGearMobileIOS.click();
    browser.sleep(delay);
  };
  this.doMobileAndroid = function() {
    browser.waitForAngular();
    this.elMyNextGearMobileAndroid.click();
    browser.sleep(delay);
  };
}
module.exports.resources = Resources;
