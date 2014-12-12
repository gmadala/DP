'use strict';

describe('Login page e2e', function () {

  var loginPage = require('./page-object/login-page.js');

  beforeEach(function() {
    // Run into this issue on the e2e tests:
    // "Timed out waiting for Protractor to synchronize with the page after 10 seconds.
    // Please see https://github.com/angular/protractor/blob/master/docs/faq.md"
    //
    // This is caused by the $timeout polling to check if the user's session is still valid or not.
    // In the new angular (from 1.2 and up), they ask developers to use the $interval for polling timeout.
    // But we're using angular 1.0.8.
    //
    // The way to make sure the e2e to work is by disabling synchronization and then perform manual sync:
    // * by checking if an element is already present in the page or not (may not be the best approach).
    // * the other options would be, to upgrade angular :)

    // toggle this line to see this effect.
    browser.ignoreSynchronization = true;
    loginPage.openPage();
    // manually check if the page is fully loaded or not.
    loginPage.waitPage();
  });

  it("should validate login-page object is accessing the correct fields.", function () {
    loginPage.setUsername('Example');
    loginPage.setPassword('Password');

    expect(loginPage.getRememberUsername()).toBe(false);
    loginPage.setRememberUsername(true);
    expect(loginPage.getRememberUsername()).toBe(true);
    loginPage.setRememberUsername(false);
    expect(loginPage.getRememberUsername()).toBe(false);

    expect(loginPage.getUsername()).toEqual('Example');
    expect(loginPage.getPassword()).toEqual('Password');
    expect(loginPage.getSubmit()).toEqual('Log In');
  });

  it('should show error messages when credentials is incorrect.', function() {
    loginPage.doLoginWithError();

    expect(element(by.binding("errorMsg")).isPresent()).toBeTruthy();
  });

  it('should transition from login screen with correct credentials.', function() {
    loginPage.doLogin();

    expect(browser.getLocationAbsUrl()).not.toBe('#/login');
  });

});
