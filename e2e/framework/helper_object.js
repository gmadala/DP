'use strict';

var HelperObject = function () {
  this.openDashboard = function () {
    browser.get('#/dashboard');
  };

  this.describe = function (jiraIssue, describeFn) {
    var helper = this;
    describe('E2E Testing Suite for Jira Issue ' + jiraIssue + '.', function () {
      beforeEach(function () {
        browser.driver.manage().window().maximize();
        browser.ignoreSynchronization = true;
        helper.openDashboard();
      });

      describeFn();
    });
  };
};
module.exports = HelperObject;
