'use strict';

describe('Controller: AnalyticsCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var AnalyticsCtrl,
    scope, httpBackend,
    analyticsMock, q,
    $dialog;

  // Initialize the controller and a mock scope

  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $q, _$dialog_) {
    $dialog = _$dialog_;
    httpBackend = $httpBackend;
    httpBackend.when('GET', /\/dealer\/summary?.+/).respond({});
    scope = $rootScope.$new();

    analyticsMock = {
      create: function () {
        return $q.resolved(createResult);
      },
      fetchBusinessSummary : function() {},
      fetchAnalytics: function() {},
      fetchMovers: function() {}
    };

    AnalyticsCtrl = $controller('AnalyticsCtrl', {
      $scope: scope,
      Analytics: analyticsMock
    });

    spyOn($dialog, 'dialog').andReturn({ open: angular.noop });

  }));

  it('should initialize a showDetails variable', function() {
    expect(scope.showDetails).toBeDefined();
  });

  it('should attach an openTopAuctions function', function() {
    expect(typeof scope.openTopAuctions).toBe('function');

    scope.openTopAuctions();
    expect($dialog.dialog).toHaveBeenCalled();
  });

  it('should attach a toggleDetails function', function() {
    scope.showDetails = true;
    expect(typeof scope.toggleDetails).toBe('function');
    spyOn(scope, 'toggleDetails').andCallThrough();

    scope.toggleDetails();
    expect(scope.toggleDetails).toHaveBeenCalled();
    expect(scope.showDetails).toBe(false);
  });

});
