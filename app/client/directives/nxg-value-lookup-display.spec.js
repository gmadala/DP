'use strict';

describe('Directive: nxgValueLookupDisplay', function () {
  beforeEach(module('nextgearWebApp', 'client/directives/nxg-value-lookup-display/nxg-value-lookup-display.html'));

  var element,
      scope,
      rootScope,
      iScope,
      mockSearchIsDone;

  beforeEach(inject(function ($rootScope, $compile) {
    rootScope = $rootScope;

    mockSearchIsDone = false;
    scope = $rootScope.$new();
    scope.model = {
      searchDone: function() {
        return mockSearchIsDone;
      },
      noResults: false
    };

    element = angular.element(
      '<div nxg-value-lookup-display="model.myVal" search-done="model.searchDone()" no-results="model.noResults"></div>');
    element = $compile(element)(scope);
    $rootScope.$digest();

    iScope = element.isolateScope();
  }));

  it('should set the searchDone and noResult properties on the directive scope', function() {
    expect(typeof iScope.searchDone).toBe('function');
    expect(iScope.noResults).toBe(scope.model.noResults);
  });

  it('should add the dataAvailable function to combine the two flags', function() {
    expect(iScope.dataAvailable).toBeDefined();
  });

  describe('dataAvailable', function() {
    it('should return false if we have not yet performed a search', function() {
      expect(iScope.dataAvailable()).toBe(false);
    });

    it('should return true if our search is done and we have results', function() {
      mockSearchIsDone = true;
      scope.$apply();
      expect(iScope.dataAvailable()).toBe(true);
    });

    it('should return false if our search is done and we do not have results', function() {
      mockSearchIsDone = true;
      scope.model.noResults = true;
      scope.$apply();
      expect(iScope.dataAvailable()).toBe(false);
    });
  });
});
