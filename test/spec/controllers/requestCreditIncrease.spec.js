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
    failureCallback,
    mockKissMetricInfo,
    httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, $httpBackend) {
    scope = $rootScope.$new();
    rootScope = $rootScope;
    q = $q;
    httpBackend = $httpBackend;
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
    };

    mockKissMetricInfo = {
      getKissMetricInfo: function(){
        return $q.when({
          height: 1080,
          isBusinessHours: true,
          vendor: 'Google Inc.',
          version: 'Chrome 44',
          width: 1920
        });
      }
    };

    httpBackend.whenGET('/info/v1_1/businesshours').respond($q.when({}));

    RequestCreditIncreaseCtrl = $controller('RequestCreditIncreaseCtrl', {
      $scope: scope,
      dialog: dialogMock,
      $dialog: $dialogMock,
      CreditIncrease: creditIncreaseMock,
      kissMetricInfo: mockKissMetricInfo
    });
  }));

  it('should fetch the active lines of credit automatically', function () {
    rootScope.$digest();
    expect(scope.selector.linesOfCredit).toEqual(linesOfCredit);
  });

  it('should set the selected line of credit if there is only 1 active line of credit', function() {
    rootScope.$digest();
    expect(scope.selector.selectedLineOfCredit).toEqual(linesOfCredit[0]);
  });



  describe('multiple lines of credit scenario', function() {
    var scope,
    RequestCreditIncreaseCtrl,
    creditIncreaseMock,
    rootScope,
    q,
    linesOfCreditMultiple;

    beforeEach(inject(function($rootScope, $controller, $q){
      scope = $rootScope.$new();
      rootScope = $rootScope;
      q = $q;
      linesOfCreditMultiple = [{
        id: 'id1',
        type: 'retail',
        amount: 123.45
      },
      {
        id: 'id2',
        type: 'current',
        amount: 1987.60
      }];

      creditIncreaseMock = {
        getActiveLinesOfCredit: function(){
          return $q.when(linesOfCreditMultiple);
        }
      };

      RequestCreditIncreaseCtrl = $controller('RequestCreditIncreaseCtrl', {
        $scope: scope,
        dialog: dialogMock,
        $dialog: $dialogMock,
        CreditIncrease: creditIncreaseMock
      });
    }));

    it('should not set the selected line of credit an option if there are multiple lines of credit', inject(function($q) {
      rootScope.$digest();
      expect(scope.selector.selectedLineOfCredit).toBe(null);
    }));
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
    spyOn(creditIncreaseMock, 'requestCreditIncrease').and.returnValue(q.when(q.when(true)));
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
    spyOn($dialogMock, 'messageBox').and.callThrough();
    scope.confirmRequest();
    successCallback();
    expect($dialogMock.messageBox).toHaveBeenCalled();
  });

  it('should return true when user clicks on Request Credit Increase -Temp/Permanent. ', function(){
    scope.requestCreditIncreaseForm = {
      $invalid: false,
      $valid: true
    };
    scope.selector.selectedLineOfCredit = linesOfCredit[0];
    spyOn(creditIncreaseMock, 'requestCreditIncrease').and.returnValue(q.when(q.when(true)));
    scope.confirmRequest();
    scope.$apply();
    expect(scope.kissMetricData.isBusinessHours).toBe(true);
    expect(scope.kissMetricData.height).toBe(1080);
    expect(scope.kissMetricData.vendor).toBe('Google Inc.');
    expect(scope.kissMetricData.version).toBe('Chrome 44');
    expect(scope.kissMetricData.width).toBe(1920);
  });
});
