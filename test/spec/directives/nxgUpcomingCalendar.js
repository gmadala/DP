'use strict';

describe('Directive: nxgUpcomingCalendar', function () {
  beforeEach(module('nextgearWebApp'));

  var element,
    scope,
    compile,
    moment;

  beforeEach(inject(function ($rootScope, $compile, _moment_) {
    scope = $rootScope.$new();
    scope.mode = 'week';
    scope.myData = {
      openDates: {},
      eventsByDate: {},
      dueEvents: [],
      scheduledEvents: []
    };
    compile = $compile;
    moment = _moment_;
    element = angular.element('<div nxg-upcoming-calendar display="mode" data="myData"></div>');
    element = compile(element)(scope);
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
        start: moment(),
        end: moment()
      };
    scope.$on('setDateRange', handler);
    element.scope().options.viewDisplay(viewMock);
    expect(handler).toHaveBeenCalled();
    expect(handler.mostRecentCall.args[1]).toBe(viewMock.start);
    expect(handler.mostRecentCall.args[2]).toBe(viewMock.end);
  });

  describe('viewRender()', function () {
    it('should turn escaped HTML entities into actual elements', function () {
      var viewMock = {
        start: moment(),
        end: moment()
      },
      scope = element.scope();
      element = angular.element('<div><table><th class="fc-day-header">&lt;b&gt;Title1&lt;/b&gt;</th><th class="fc-day-header">&lt;i&gt;Title2&lt;/i&gt;</th></table></div>');
      scope.options.viewRender(viewMock, element);

      expect(element.find('th').first().html()).toEqual('<b>Title1</b>');
      expect(element.find('th').last().html()).toEqual('<i>Title2</i>');
    });

    it('should hide first row if all weekdays are in previous month', function() {
      var viewMock = {
        start: moment(),
        end: moment()
      },
      scope = element.scope();
      element = angular.element('<div><table><tbody><tr class="fc-week fc-first">'+
                                '<td class="fc-other-month">Monday</td>'+
                                '<td class="fc-other-month">Tuesday</td>'+
                                '<td class="fc-other-month">Wednesday</td>'+
                                '<td class="fc-other-month">Thursday</td>'+
                                '<td class="fc-other-month">Friday</td>'+
                                '</tr>'+
                                '<tr class="fc-week">'+
                                '</tr></tbody></table></div>');
      scope.options.viewRender(viewMock, element);

      expect(element.find('tr').first().hasClass('hide')).toBeTruthy();
      expect(element.find('tr').last().hasClass('fc-first')).toBeTruthy();
    });

    it('should hide last row if all weekdays are in next month', function() {
      var viewMock = {
        start: moment(),
        end: moment()
      },
      scope = element.scope();
      element = angular.element('<div><table><tbody><tr class="fc-week"></tr>'+
                                '<tr class="fc-week fc-last">'+
                                '<td class="fc-other-month">Monday</td>'+
                                '<td class="fc-other-month">Tuesday</td>'+
                                '<td class="fc-other-month">Wednesday</td>'+
                                '<td class="fc-other-month">Thursday</td>'+
                                '<td class="fc-other-month">Friday</td>'+
                                '</tr></tbody></table></div>');
      scope.options.viewRender(viewMock, element);

      expect(element.find('tr').last().hasClass('hide')).toBeTruthy();
      expect(element.find('tr').first().hasClass('fc-last')).toBeTruthy();
    });

  });

  describe('dayRender()', function () {

    it('should mark closed day as closed', function () {
      var ele = angular.element('<td class="fc-day"><div><div class="fc-day-number">29</div><div class="fc-day-content"><div>&nbsp;</div></div></div></td>');
      element.scope().openDates = {
        '1990-01-01': true,
        '1990-01-02': true
      };
      element.scope().options.dayRender(moment().toDate(), ele);
      expect(ele.hasClass('closed')).toBeTruthy();
    });

    it('should mark open day as not closed', function () {
      var ele = angular.element('<td class="fc-day closed"><div><div class="fc-day-number">29</div><div class="fc-day-content"><div>&nbsp;</div></div></div></td>');
      element.scope().openDates = {
        '1990-01-01': true,
        '1990-01-02': true
      };
      element.scope().options.dayRender(moment('1990-01-01', 'YYYY-MM-DD').toDate(), ele);
      expect(ele.hasClass('closed')).toBeFalsy();
    });

    it('should recognize date string', function () {
      var ele = angular.element('<td class="fc-day closed"><div><div class="fc-day-number">29</div><div class="fc-day-content"><div>&nbsp;</div></div></div></td>');
      element.scope().openDates = {
        '1990-01-01': true,
        '1990-01-02': true
      };
      element.scope().options.dayRender('1990-01-01', ele);
      expect(ele.hasClass('closed')).toBeFalsy();
    });

    it('should add date element if one does not exist', function () {
      var ele = angular.element('<td class="fc-day closed"><div><div class="fc-day-content"><div>&nbsp;</div></div></div></td>');
      element.scope().openDates = {
        '1990-01-01': true,
        '1990-01-02': true
      };
      element.scope().options.dayRender('1990-01-10', ele);
      expect(ele.find('.fc-day-number').text()).toEqual('10');
    });

    it('should add has-events class if day has events', function () {
      var ele = angular.element('<td class="fc-day closed"><div><div class="fc-day-content"><div>&nbsp;</div></div></div></td>');
      element.scope().openDates = {
        '1990-01-10': true
      };
      element.scope().eventsByDate = {
        '1990-01-10': ['Event 1', 'Event 2']
      };
      element.scope().options.dayRender('1990-01-10', ele);
      expect(ele.hasClass('has-events')).toBeTruthy();
    });

    it('should remove has-events class if day has no events', function () {
      var ele = angular.element('<td class="fc-day closed"><div><div class="fc-day-content"><div>&nbsp;</div></div></div></td>');
      element.scope().openDates = {
        '1990-01-10': true
      };
      element.scope().eventsByDate = {
        '1990-01-10': []
      };
      element.scope().options.dayRender('1990-01-10', ele);
      expect(ele.hasClass('has-events')).toBeFalsy();
    });

  });


  describe('eventRender()', function () {
    it('should turn escaped HTML entities into actual elements', function () {
      var eventMock = {
        start: moment(),
        subTitle: 'event subtitle'
      },
      scope = element.scope();
      element = angular.element('<div><table><span class="fc-event-title">&lt;b&gt;Title1&lt;/b&gt;</span><span class="fc-event-title">&lt;i&gt;Title2&lt;/i&gt;</span></table></div>');
      scope.options.eventRender(eventMock, element);

      expect(element.find('span').first().html()).toEqual('<b>Title1</b>');
      expect(element.find('span').last().html()).toEqual('<i>Title2</i>');
    });

    it('should add class for events today', function () {
      var eventMock = {
        start: moment(),
        subTitle: 'event subtitle'
      },
      scope = element.scope();
      element = angular.element('<div><table><span class="fc-event-title">&lt;b&gt;Title1&lt;/b&gt;</span><span class="fc-event-title">&lt;i&gt;Title2&lt;/i&gt;</span></table></div>');
      scope.options.eventRender(eventMock, element);

      expect(element.hasClass('today')).toBeTruthy();
      expect(element.hasClass('overdue')).toBeFalsy();
    });

    it('should add class for events overdue', function () {
      var eventMock = {
        start: moment().subtract('days', 1),
        subTitle: 'event subtitle'
      },
      scope = element.scope();
      element = angular.element('<div><table><span class="fc-event-title">&lt;b&gt;Title1&lt;/b&gt;</span><span class="fc-event-title">&lt;i&gt;Title2&lt;/i&gt;</span></table></div>');
      scope.options.eventRender(eventMock, element);

      expect(element.hasClass('overdue')).toBeTruthy();
      expect(element.hasClass('today')).toBeFalsy();
    });
  });

  describe('scope.watch(data)', function () {
    it('should watch scope.data and update when data is not null', function () {
      element.scope().data.openDates = 'string';
      element.scope().$apply();

      expect(element.scope().openDates).toEqual('string');
    });

    it('should watch scope.data and not update when data is null', function () {
      element.scope().data = null;
      element.scope().$apply();

      expect(element.scope().openDates).toEqual({});
    });

    it('should render each fc-day cell', function () {
      element.append('<div class="fc-day"></div><div class="fc-day"></div><div class="fc-day"></div>');

      element.scope().data.openDates = 'string';

      spyOn(element.scope().options, 'dayRender');
      element.scope().$apply();

      expect(element.scope().options.dayRender.calls.length).toEqual(3);
    });
  });
});
