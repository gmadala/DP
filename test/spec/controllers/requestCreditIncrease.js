'use strict';

describe('Controller: RequestCreditIncreaseCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var RequestCreditIncreaseCtrl,
    scope,
    creditIncreaseMock,
    dialogMock,
    $dialogMock,
    linesOfCredit,
    rootScope,
    q,
    successCallback,
    failureCallback;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q) {
    scope = $rootScope.$new();
    rootScope = $rootScope;
    q = $q;
    linesOfCredit = [{
      id: 'id',
      type: 'retail',
      amount: 123.45
    }];
    creditIncreaseMock = {
      getActiveLinesOfCredit: function(){
        return $q.when(linesOfCredit);
      },
      requestCreditIncrease: function() {
        return {
          then: function(success, failure){
            successCallback = success;
            failureCallback = failure;
          }
        };
      }
    };
    dialogMock = {
      close: function(){
        return {
          then: function(callback){
            callback();
          }
        };
      }
    };
    $dialogMock = {
      messageBox: function(){
        return {open: angular.noop};
      }
    }

    RequestCreditIncreaseCtrl = $controller('RequestCreditIncreaseCtrl', {
      $scope: scope,
      dialog: dialogMock,
      $dialog: $dialogMock,
      CreditIncrease: creditIncreaseMock
    });
  }));

  it('should fetch the active lines of credit automatically', function () {
    rootScope.$digest();
    expect(scope.selector.linesOfCredit).toEqual(linesOfCredit);
  });

  it('should not submit the request if the form is invalid', function () {
    scope.requestCreditIncreaseForm = {
      $invalid: true,
      $valid: false
    };
    spyOn(creditIncreaseMock, 'requestCreditIncrease');
    scope.confirmRequest();
    expect(creditIncreaseMock.requestCreditIncrease).not.toHaveBeenCalled();
  });

  it('should submit the request if the form is valid', function () {
    scope.requestCreditIncreaseForm = {
      $invalid: false,
      $valid: true
    };
    scope.selector.selectedLineOfCredit = linesOfCredit[0];
    spyOn(creditIncreaseMock, 'requestCreditIncrease').andReturn(q.when(q.when(true)));
    scope.confirmRequest();
    scope.$digest();
    expect(creditIncreaseMock.requestCreditIncrease).toHaveBeenCalled();
  });

  it('should set loading properly on submit', function () {
    scope.requestCreditIncreaseForm = {
      $invalid: false,
      $valid: true
    };
    scope.selector.selectedLineOfCredit = linesOfCredit[0];
    scope.confirmRequest();
    expect(scope.loading).toBeTruthy();
    successCallback();
    expect(scope.loading).toBeFalsy();
  });

  it('should reset loading properly on failure', function() {
    scope.requestCreditIncreaseForm = {
      $invalid: false,
      $valid: true
    };
    scope.selector.selectedLineOfCredit = linesOfCredit[0];
    scope.confirmRequest();
    failureCallback();
    expect(scope.loading).toBeFalsy();
  });

  it('should set loading properly while waiting for lines of credit to load', function () {
    expect(scope.loading).toBeTruthy();
    rootScope.$digest();
    expect(scope.loading).toBeFalsy();
  });

  it('should close modal when loading finishes', function () {
    scope.requestCreditIncreaseForm = {
      $invalid: false,
      $valid: true
    };
    scope.selector.selectedLineOfCredit = linesOfCredit[0];
    spyOn(dialogMock, 'close');
    scope.confirmRequest();
    successCallback();
    expect(dialogMock.close).toHaveBeenCalled();
  });

  it('should open confirmation window once loading finishes', function () {
    scope.requestCreditIncreaseForm = {
      $invalid: false,
      $valid: true
    };
    scope.selector.selectedLineOfCredit = linesOfCredit[0];
    spyOn($dialogMock, 'messageBox').andCallThrough();
    scope.confirmRequest();
    successCallback();
    expect($dialogMock.messageBox).toHaveBeenCalled();
  });
});
