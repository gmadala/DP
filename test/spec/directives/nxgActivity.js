'use strict';

describe('Directive: nxgActivity', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgActivity/nxgActivity.html'));

  var element,
    scope,
    status,
    httpBackend,
    http;

  beforeEach(inject(function ($rootScope, $compile, $http, $httpBackend, _status_) {
    status = _status_;
    httpBackend = $httpBackend;
    http = $http;
    scope = $rootScope;

    element = angular.element('<div nxg-activity></div>');
    element = $compile(element)($rootScope);
    $rootScope.$digest();
  }));

  it('should be hidden by default', function () {
    expect(element.css('display')).toBe('none');
  });

  it('should display while there are in-progress http requests, and it has not been suppressed', function () {
    httpBackend.whenGET('/foo').respond('OK');

    http.get('/foo');
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
    expect(element.css('display')).not.toBe('none');

    httpBackend.flush();
    scope.$apply();
    expect(element.css('display')).toBe('none');
  });

});
