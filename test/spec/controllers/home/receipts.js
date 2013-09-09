'use strict';

describe('Controller: ReceiptsCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var ReceiptsCtrl,
      scope,
      receiptsMock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q) {
    receiptsMock = {
      search: function () {
        var deferred = $q.defer();
        deferred.resolve({
          'Success': true,
          'Message': null,
          'Data': {
            'Receipts': [{}]
          }
        });
        $rootScope.$apply();
        return deferred.promise;
      }
    };

    scope = $rootScope.$new();
    ReceiptsCtrl = $controller('ReceiptsCtrl', {
      $scope: scope,
      Receipts: receiptsMock
    });
  }));

  it('should attach filterOptions to the scope', function () {
    expect(angular.isArray(scope.filterOptions)).toBe(true);
  });

  it('should attach search function to the scope', function () {
    expect(typeof scope.search).toBe('function');
  });

  describe('search function', function () {

    it('should call receipts model search function with criteria', function () {
      spyOn(receiptsMock, 'search').andCallThrough();
      scope.searchCriteria = {
        query: 'foo'
      };

      scope.search();
      expect(receiptsMock.search).toHaveBeenCalledWith(scope.searchCriteria);
    });

    it('should attach results promise to the scope', function () {
      scope.search();
      expect(scope.results).toBeDefined();
      expect(typeof scope.results.then).toBe('function');
    });

  });

  it('should attach resetSearch function to the scope', function () {
    expect(typeof scope.resetSearch).toBe('function');
  });

  describe('resetSearch function', function () {

    it('should set appropriate search defaults', function () {
      scope.resetSearch();
      expect(scope.searchCriteria).toBeDefined();
      expect(scope.searchCriteria.query).toBe(null);
      expect(scope.searchCriteria.startDate).toBe(null);
      expect(scope.searchCriteria.endDate).toBe(null);
      expect(scope.searchCriteria.filter).toBe('all');
    });

    it('should call search method', function () {
      spyOn(scope, 'search');
      scope.resetSearch();
      expect(scope.search).toHaveBeenCalled();
    });

  });

  it('should honor a provided search keyword from the URL params', inject(function ($controller) {
    spyOn(receiptsMock, 'search').andCallThrough();
    $controller('ReceiptsCtrl', {
      $scope: scope,
      $stateParams: {search: '123'},
      Receipts: receiptsMock
    });

    expect(receiptsMock.search.mostRecentCall.args[0].query).toBe('123');
  }));

});
