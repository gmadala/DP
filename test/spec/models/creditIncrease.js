'use strict';

describe('Service: CreditIncrease', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var creditIncrease,
      httpBackend,
      getResponse, getData,
      rootScope;

  beforeEach(inject(function (CreditIncrease, $httpBackend, $rootScope) {
    creditIncrease = CreditIncrease;
    httpBackend = $httpBackend;
    rootScope = $rootScope;

    getResponse = {
      Success: true,
      Message: null,
      Data: [
        {
          LineOfCreditId: 'id1',
          CreditTypeName: 'name1',
          Limit: 123
        },
        {
          LineOfCreditId: 'id2',
          CreditTypeName: 'name2',
          Limit: 456
        },
        {
          LineOfCreditId: 'id3',
          CreditTypeName: 'name3',
          Limit: 789
        }
      ]
    };
    getData = [
      {
        id: 'id1',
        type: 'name1',
        amount: 123
      },
      {
        id: 'id2',
        type: 'name2',
        amount: 456
      },
      {
        id: 'id3',
        type: 'name3',
        amount: 789
      }
    ];

  }));

  describe('getActiveLinesOfCredit function', function () {

    it('should make an API request', function () {
      httpBackend.expectGET('/dealer/ActiveLinesOfCredit').respond(getResponse);
      creditIncrease.getActiveLinesOfCredit();
      expect(httpBackend.flush).not.toThrow();
    });

    it('should transform API data', function () {
      httpBackend.expectGET('/dealer/ActiveLinesOfCredit').respond(getResponse);
      var result;
      creditIncrease.getActiveLinesOfCredit().then(function(res) {
        result = res;
      });
      httpBackend.flush();
      rootScope.$digest();
      expect(result).toEqual(getData);
    });

  });

  describe('requestCreditIncrease function', function () {

    var request;

    beforeEach(function () {
      httpBackend.expectPOST('/dealer/requestCreditIncrease').respond(function(method, path, data){
        request = angular.fromJson(data);
        return {
          Success: true,
          Message: null,
          Data: null
        };
      });
    });

    it('should make an API request', function () {
      creditIncrease.requestCreditIncrease('id', true, 23);
      expect(httpBackend.flush).not.toThrow();
    });

    it('should send the expected data', function () {
      creditIncrease.requestCreditIncrease('id', true, 23);
      httpBackend.flush();
      expect(request).toEqual({
        LineOfCreditId: 'id',
        IsTemporary: true,
        Amount: 23
      });
    });

  });

});
