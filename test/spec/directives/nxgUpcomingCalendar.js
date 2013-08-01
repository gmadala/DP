'use strict';

describe('Directive: nxgUpcomingCalendar', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgUpcomingCalendar/nxgUpcomingDetailPopup.html'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    scope.mode = 'week';
    element = angular.element('<div nxg-upcoming-calendar display="mode"></div>');
    element = $compile(element)(scope);
  }));

  it('should create a div with ui-calendar directive', function () {
    expect(element.find('div[ui-calendar]').length).toBe(1);
  });

  it('should attach an eventSources object to its scope', function () {
    expect(angular.isArray(element.scope().eventSources)).toBe(true);
  });

  it('should attach an options object to its scope', function () {
    expect(element.scope().options).toBeDefined();
  });

  it('should tell the calendar to rebuild when display setting changes in the parent scope', function () {
    spyOn(element.scope().cal, 'fullCalendar');

    scope.$apply(function () {
      scope.mode = 'month';
    });
    expect(element.scope().cal.fullCalendar).toHaveBeenCalledWith('destroy');
    expect(element.scope().cal.fullCalendar).toHaveBeenCalledWith(element.scope().options);
  });

});
