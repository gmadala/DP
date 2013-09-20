'use strict';

describe('Controller: AnalyticsCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var AnalyticsCtrl,
    scope, httpBackend,
    analyticsMock, q;


  // Initialize the controller and a mock scope
  
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $q) {
  
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
     $dialog: {
        close: function() {}
      },
      Analytics: analyticsMock
    });
  
  }));


  it('should exist', function () {
    expect(scope.openTopAuctions).toBeDefined;
  });

});
