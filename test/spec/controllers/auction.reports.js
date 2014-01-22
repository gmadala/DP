'use strict';

describe('Controller: AuctionReportsCtrl', function() {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var AuctionReportsCtrl,
    scope,
    dashboard,
    api,
    formDataMock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, api) {
    scope = $rootScope.$new();
    api = api;
    formDataMock = {
      $valid: false,
      disDate: {
        $invalid: true
      }
    };

    AuctionReportsCtrl = $controller('AuctionReportsCtrl', {
      $scope: scope
    });

    scope.disForm = formDataMock;
    scope.data = {
      disDate: new Date(2014, 0, 20)
    };
  }));

  it('should attach metric names to the scope', function() {
    expect(scope.metric).toBeDefined();
  });

  it('should contain a list of documents', function() {
    expect(scope.documents).toBeDefined();
  });

  describe('viewDisbursementDetail function', function() {
    it('should check form validity and return if invalid', function() {
      spyOn(window, 'open').andReturn();

      expect(scope.data).toBeDefined();
      scope.viewDisbursementDetail();
      expect(scope.disFormValidity).toBeDefined();
      expect(window.open).not.toHaveBeenCalled();
    });

    it('should create an api link and open the report in a new tab if the form is valid', function() {
      spyOn(window, 'open').andReturn();
      scope.disForm.$valid = true;

      scope.viewDisbursementDetail();
      var expectedStr = '/report/disbursementdetail/2014-01-20/Disbursements-2014-01-20';
      expect(window.open).toHaveBeenCalledWith(expectedStr, '_blank');
    });
  });


});
