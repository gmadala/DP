'use strict';

describe('Directive: nxgActivity', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgActivity/nxgActivity.html'));

  var element,
    scope,
    status,
    httpBackend,
    http,
    timeout,
    user;

  beforeEach(inject(function ($rootScope, $compile, $http, $httpBackend, $timeout, _status_, User) {
    status = _status_;
    httpBackend = $httpBackend;
    http = $http;
    scope = $rootScope;
    timeout = $timeout;
    user = User;
    user.isLoggedIn = function(){ return true; };

    element = angular.element('<div nxg-activity></div>');
    element = $compile(element)($rootScope);
    $rootScope.$digest();
  }));

  it('should be hidden by default', function () {
    expect(element.css('display')).toBe('none');
  });

  it('should display after delay while there are in-progress http requests, and it has not been suppressed', function () {
    httpBackend.whenGET('/foo').respond('OK');

    http.get('/foo');
    scope.$apply();
    expect(element.css('display')).toBe('none');

    timeout.flush();
    scope.$apply();
    expect(element.css('display')).not.toBe('none');

    httpBackend.flush();
    scope.$apply();
    expect(element.css('display')).toBe('none');
  });

  it('should NOT display while there are in-progress http requests, and it has been suppressed', function () {
    status.hide();
    httpBackend.whenGET('/foo').respond('OK');

    http.get('/foo');
    scope.$apply();
    expect(element.css('display')).toBe('none');

    status.show();
    scope.$apply();
    timeout.flush();
    expect(element.css('display')).not.toBe('none');

    httpBackend.flush();
    scope.$apply();
    expect(element.css('display')).toBe('none');
  });

});
