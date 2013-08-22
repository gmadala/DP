'use strict';

describe('Directive: nxgDateField', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgDateField/nxgDateField.html'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope;
    scope.bar = new Date();
    element = angular.element('<form name="form">' +
      '<input name="dateInput" id="foo" ng-model="bar" nxg-date-field />' +
      '</form>');
    element = $compile(element)(scope);
    scope.$digest();
  }));

  it('should replace the input with bs-datepicker-ified input + button', function () {
    expect(element.find('input').attr('bs-datepicker')).toBeDefined();
    expect(element.find('button').attr('data-toggle')).toBe('datepicker');
  });

  it('should keep the id on the input itself', function () {
    expect(element.find('#foo').is('input')).toBe(true);
  });

  it('should not interfere with ng-model working', function () {
    var value = new Date(2013, 0, 1);
    scope.form.dateInput.$setViewValue(value);
    expect(scope.bar).toBe(value);
  });

});
