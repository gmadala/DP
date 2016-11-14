'use strict'

describe('Controller: ReviewRequestCtrl', function () {

  beforeEach(module('nextgearWebApp'));

  var scope, mockUser, initController, ReviewRequest;

  beforeEach(inject(function ($rootScope, $controller) {

    scope = $rootScope.$new();

    mockUser = {
      isDealer: function () {
        return false;
      }
    };

    // create the mock parent scope object
    scope.$parent = {
      wizardFloor: {
        options: {
          buyerPayWhenTitleIsInBuyersPossession: true
        },
        stateChangeCounterFix: function () {
          return false;
        }
      }
    };

    scope.form = {
      $valid: false
    };

    spyOn(scope.$parent.wizardFloor, 'stateChangeCounterFix').and.callThrough();

    initController = function () {
      ReviewRequest = $controller('ReviewRequestCtrl', {
        $scope: scope,
        user: mockUser
      });
    };
    initController();
  }));

  it('should check the Dealer mode', function () {
    spyOn(mockUser, 'isDealer').and.returnValue(true);
    initController();
  });

  it('should check for isBuyerPayBuyersPossession value is true', function () {
    expect(scope.isBuyerPayBuyersPossession).toBe(true);
  });

  it('should check for isBuyerPayBuyersPossession value is false', function () {
    scope.$parent = {
      wizardFloor: {
        options: {
          buyerPayWhenTitleIsInBuyersPossession: false
        },
        stateChangeCounterFix: function () {
          return false;
        }
      }
    };
    initController();
    expect(scope.isBuyerPayBuyersPossession).toBe(false);
  });

  it('should test for the transitionValidation', function () {
    scope.$parent.wizardFloor.transitionValidation();
    expect(scope.$parent.wizardFloor.validity).toEqual(scope.form);
    expect(scope.form.$submitted).toBe(true);
  });

});