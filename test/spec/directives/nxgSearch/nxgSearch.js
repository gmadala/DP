'use strict';

describe('Directive: nxgSearch', function () {
  beforeEach(module('nextgearWebApp'));

  // this directive is little more than template + controller, so just test the controller
  describe('NxgSearchCtrl', function () {

    var ctrl,
      scope,
      attrs;

    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();

      attrs = {};

      ctrl = $controller('NxgSearchCtrl', {
        $scope: scope,
        $attrs: attrs
      });
    }));

    it('should attach a dateRangeShown boolean to the scope, defaulting to true', function () {
      expect(scope.dateRangeShown).toBe(true);
    });

    it('should watch showDateRange attribute function, if present, to set dateRangeShown', inject(function ($controller) {
      var ret = false;
      attrs.showDateRange = 'foo';
      scope.showDateRange = function () {
        return ret;
      };
      ctrl = $controller('NxgSearchCtrl', {
        $scope: scope,
        $attrs: attrs
      });

      scope.$apply();
      expect(scope.dateRangeShown).toBe(false);

      ret = true;
      scope.$apply();
      expect(scope.dateRangeShown).toBe(true);
    }));

    it('should attach a dateRangeValid function to the scope', function () {
      expect(typeof scope.dateRangeValid).toBe('function');
    });

    describe('dateRangeValid function', function () {

      it('should return true if the date range is hidden', function () {
        scope.dateRangeShown = false;
        expect(scope.dateRangeValid(new Date(2013, 1, 1), new Date(2013, 0, 1))).toBe(true);
      });

      it('should return true if either or both dates are null', function () {
        expect(scope.dateRangeValid(new Date(), null)).toBe(true);
        expect(scope.dateRangeValid(null, new Date())).toBe(true);
        expect(scope.dateRangeValid(null, null)).toBe(true);
      });

      it('should return true if end date is equal to or after start date', function () {
        expect(scope.dateRangeValid(new Date(2013, 1, 1), new Date(2013, 1, 1))).toBe(true);
        expect(scope.dateRangeValid(new Date(2013, 1, 1), new Date(2013, 1, 2))).toBe(true);
      });

      it('should return false if end date is before start date', function () {
        expect(scope.dateRangeValid(new Date(2013, 1, 1), new Date(2013, 0, 1))).toBe(false);
      });

    });

    it('should attach a search function to the scope', function () {
      expect(typeof scope.search).toBe('function');
    });

    describe('search function', function () {

      it('should copy the form controller state to scope.validity', function () {
        scope.searchForm = {
          $valid: false,
          foo: 'bar',
          $error: {}
        };
        scope.search();
        expect(scope.validity.$valid).toBe(false);
        expect(scope.validity.foo).toBe('bar');
      });

      it('should not call the onSearch function if searchForm is invalid', function () {
        scope.onSearch = jasmine.createSpy('onSearch');
        scope.searchForm = {
          $valid: false,
          $error: {}
        };
        scope.search();
        expect(scope.onSearch).not.toHaveBeenCalled();
      });

      it('should call the onSearch function if searchForm is valid', function () {
        scope.onSearch = jasmine.createSpy('onSearch');
        scope.searchForm = {
          $valid: true,
          $error: {}
        };
        scope.search();
        expect(scope.onSearch).toHaveBeenCalled();
      });

    });

    it('should attach a clear function to the scope', function () {
      expect(typeof scope.clear).toBe('function');
    });

    describe('clear function', function () {
      it('should call the onClear function', function () {
        scope.onClear = jasmine.createSpy('onClear');
        scope.clear({preventDefault: angular.noop});
        expect(scope.onClear).toHaveBeenCalled();
      });

    });

  });

});
