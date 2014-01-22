'use strict';

describe('Controller: AuctionDocumentsCtrl', function() {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var AuctionDocumentsCtrl,
    scope,
    dashboard;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();


    AuctionDocumentsCtrl = $controller('AuctionDocumentsCtrl', {
      $scope: scope
    });
  }));

  it('should attach metric names to the scope', function() {
    expect(scope.metric).toBeDefined();
  });

  it('should attach a list of documents to the scope', function() {
    expect(scope.documents).toBeDefined();
  });

});
