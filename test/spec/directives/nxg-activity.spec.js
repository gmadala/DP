'use strict';

describe('Directive: nxgActivity', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxg-activity/nxg-activity.html'));

  var element,
    scope,
    status,
    httpBackend,
    http,
    timeout;

  beforeEach(inject(function ($rootScope, $compile, $http, $httpBackend, $timeout, _status_) {
    status = _status_;
    httpBackend = $httpBackend;
    http = $http;
    scope = $rootScope;
    timeout = $timeout;

    element = angular.element('<div nxg-activity></div>');
    element = $compile(element)($rootScope);
    $rootScope.$digest();
  }));

  it('should be hidden by default', function () {
    expect(element.hasClass('ng-hide')).toBeTruthy();
  });

  it('should display after delay while there are in-progress http requests, and it has not been suppressed', function () {
    httpBackend.whenGET('/foo').respond('OK');

    http.get('/foo');
    scope.$apply();
    expect(element.hasClass('ng-hide')).toBeTruthy();

    timeout.flush();
    scope.$apply();
    expect(element.hasClass('ng-hide')).toBeFalsy();

    httpBackend.flush();
    scope.$apply();
    expect(element.hasClass('ng-hide')).toBeTruthy();
  });

  it('should NOT display while there are in-progress http requests, and it has been suppressed', function () {
    status.hide();
    httpBackend.whenGET('/foo').respond('OK');

    http.get('/foo');
    scope.$apply();
    expect(element.hasClass('ng-hide')).toBeTruthy();

    status.show();
    scope.$apply();
    timeout.flush();
    expect(element.hasClass('ng-hide')).toBeFalsy();

    httpBackend.flush();
    scope.$apply();
    expect(element.hasClass('ng-hide')).toBeTruthy();
  });

});
