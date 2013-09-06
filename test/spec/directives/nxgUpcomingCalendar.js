'use strict';

describe('Directive: nxgUpcomingCalendar', function () {
  beforeEach(module('nextgearWebApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    scope.mode = 'week';
    scope.myData = {
      openDates: {},
      eventsByDate: {},
      dueEvents: [],
      scheduledEvents: []
    };
    element = angular.element('<div nxg-upcoming-calendar display="mode" data="myData"></div>');
    element = $compile(element)(scope);
  }));

  it('should create a div with ui-calendar directive', function () {
    expect(element.find('div[ui-calendar]').length).toBe(1);
  });

  it('should bind the display value into its scope', function () {
    expect(element.scope().display).toBe('week');
  });

  it('should bind the data value into its scope', function () {
    expect(element.scope().data).toBe(scope.myData);
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
      scope.mode = 'week';
    });
    // first time won't do it, we have to call a second time
    scope.$apply(function () {
      scope.mode = 'month';
    });
    expect(element.scope().cal.fullCalendar).toHaveBeenCalledWith('destroy');
    expect(element.scope().cal.fullCalendar).toHaveBeenCalledWith(element.scope().options);
  });

  it('should emit a setDateRange event when the calendar loads up a date range', function () {
    var handler = jasmine.createSpy('eventHandler'),
      viewMock = {
        start: new Date(),
        end: new Date()
      };
    scope.$on('setDateRange', handler);
    element.scope().options.viewDisplay(viewMock);
    expect(handler).toHaveBeenCalled();
    expect(handler.mostRecentCall.args[1]).toBe(viewMock.start);
    expect(handler.mostRecentCall.args[2]).toBe(viewMock.end);
  });

});
