'use strict';

describe('Directive: nxgMin', function () {
  // see http://stackoverflow.com/questions/15219717/to-test-a-custom-validation-angular-directive

  beforeEach(module('nextgearWebApp'));

  var scope, element, form;

  describe('with constant min setting', function () {

    beforeEach(inject(function ($rootScope, $compile) {
      scope = $rootScope;
      element = angular.element(
        '<form name="form">' +
          '<input type="text" name="input" ng-model="model.data" nxg-min="100"></input>' +
        '</form>'
      );
      scope.model = {data: undefined};
      element = $compile(element)($rootScope);
      scope.$digest();
      form = scope.form;
    }));

    it('should ignore non-numeric strings', function () {
      form.input.$setViewValue('abc123');
      expect(scope.model.data).toEqual('abc123');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue(' ');
      expect(scope.model.data).toEqual(' ');
      expect(form.input.$valid).toBe(true);
    });

    it('should pass with numeric strings above or at the min', function () {
      form.input.$setViewValue('123');
      expect(scope.model.data).toEqual('123');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('100');
      expect(scope.model.data).toEqual('100');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('100.01');
      expect(scope.model.data).toEqual('100.01');
      expect(form.input.$valid).toBe(true);
    });

    it('should fail with numeric strings below the min', function () {
      form.input.$setViewValue('99');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);

      form.input.$setViewValue('99.99');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);

      form.input.$setViewValue('-10000000.00');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);
    });

  });

  describe('with variable min setting', function () {

    beforeEach(inject(function ($rootScope, $compile) {
      scope = $rootScope;
      element = angular.element(
        '<form name="form">' +
          '<input type="text" name="input" ng-model="model.data" nxg-min="settings.minAllowed"></input>' +
          '</form>'
      );
      scope.model = {data: undefined};
      scope.settings = {minAllowed: 100};
      element = $compile(element)($rootScope);
      scope.$digest();
      form = scope.form;
    }));

    it('should ignore non-numeric strings', function () {
      form.input.$setViewValue('abc123');
      expect(scope.model.data).toEqual('abc123');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue(' ');
      expect(scope.model.data).toEqual(' ');
      expect(form.input.$valid).toBe(true);
    });

    it('should pass with numeric strings above or at the min', function () {
      form.input.$setViewValue('123');
      expect(scope.model.data).toEqual('123');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('100');
      expect(scope.model.data).toEqual('100');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('100.01');
      expect(scope.model.data).toEqual('100.01');
      expect(form.input.$valid).toBe(true);
    });

    it('should fail with numeric strings below the min', function () {
      form.input.$setViewValue('99');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);

      form.input.$setViewValue('99.99');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);

      form.input.$setViewValue('-10000000.00');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);
    });

    it('should respect changes to the setting', function () {
      form.input.$setViewValue('99');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);

      scope.$apply(function () {
        scope.settings.minAllowed = 50;
      });

      form.input.$setViewValue('98');
      expect(scope.model.data).toBe('98');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('50');
      expect(scope.model.data).toBe('50');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('48');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);
    });

    it('should allow anything if the setting is non-numeric', function () {
      scope.$apply(function () {
        scope.settings.minAllowed = 'foo';
      });

      form.input.$setViewValue('abc123');
      expect(scope.model.data).toEqual('abc123');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('50');
      expect(scope.model.data).toBe('50');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('-10329508345');
      expect(scope.model.data).toBe('-10329508345');
      expect(form.input.$valid).toBe(true);
    });

    it('should permit a setting of 0', function () {
      scope.$apply(function () {
        scope.settings.minAllowed = 0;
      });

      form.input.$setViewValue('1');
      expect(scope.model.data).toBe('1');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('0');
      expect(scope.model.data).toBe('0');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('-1');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);
    });

    it('should permit a negative setting', function () {
      scope.$apply(function () {
        scope.settings.minAllowed = -100;
      });

      form.input.$setViewValue('50');
      expect(scope.model.data).toBe('50');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('0');
      expect(scope.model.data).toBe('0');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('-99.9');
      expect(scope.model.data).toBe('-99.9');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('-100');
      expect(scope.model.data).toBe('-100');
      expect(form.input.$valid).toBe(true);

      form.input.$setViewValue('-101');
      expect(scope.model.data).toBeUndefined();
      expect(form.input.$valid).toBe(false);
    });

  });

});
