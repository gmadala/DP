/**
 * Created by gayathrimadala on 1/5/15.
 */
/**
 * Created by gayathrimadala on 12/29/14.
 */

'use strict';
var accMgtlObject = require('../framework/account_management_page_object.js');

var accMgtPage = new accMgtlObject();

describe('Account Management Page', function(){

  beforeEach(function(){
    browser.ignoreSynchronization = true;
    browser.get(accMgtPage.accountMgtUrl);
  });

  it('should check for the Request a Credit Increase', function(){
    expect(browser.getCurrentUrl()).toContain(accMgtPage.accountMgtUrl);
    accMgtPage.goTorequestCreditIncrease();
  });

  it('should check for the Request an Extension - Confirm Request', function(){
    expect(browser.getCurrentUrl()).toContain(accMgtPage.accountMgtUrl);
    accMgtPage.goToGOFinancial();
  });

});
