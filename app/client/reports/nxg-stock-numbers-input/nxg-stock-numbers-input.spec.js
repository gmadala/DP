'use strict';

describe('Directive: nxgStockNumbersInput', function () {
  beforeEach(module('nextgearWebApp', 'client/reports/nxg-stock-numbers-input/nxg-stock-numbers-input.html'));

  var element,
    scope,
    dScope;

  beforeEach(inject(function ($rootScope, $compile, $controller) {
    scope = $rootScope.$new();

    element = angular.element(
      '<div nxg-stock-numbers-input="foo" data="data" form="form"></div>');
    element = $compile(element)(scope);
    $rootScope.$digest();

    dScope = element.isolateScope();
  }));

  it('should have a data object', function() {
    expect(dScope.data).toBeDefined();
  });

  describe('selectChange function', function() {
    it('should exist', function() {
      expect(typeof dScope.selectChange).toBe('function');
    });

    it('should show empty range fields when needed', function() {
      dScope.data.selectData.value = dScope.data.selectData.values[1];
      dScope.selectChange();

      expect(dScope.isRange).toBe(true);
      expect(dScope.isSpecific).toBe(false);
    });

    it('should show specific range field when needed', function() {
      dScope.data.selectData.value = dScope.data.selectData.values[2];
      dScope.selectChange();

      expect(dScope.isRange).toBe(false);
      expect(dScope.isSpecific).toBe(true);
    });

    it('should hide additional fiels if "none" is selected', function() {
      dScope.data.selectData.value = dScope.data.selectData.values[0];
      dScope.selectChange();

      expect(dScope.isRange).toBe(false);
      expect(dScope.isSpecific).toBe(false);
    });
  });

});
