'use strict';

describe('Directive: nxgUpcomingCalendar', function () {
  beforeEach(module('nextgearWebApp'));

  var element,
    scope,
    compile,
    moment;

  beforeEach(inject(function ($rootScope, $compile, _moment_, uiCalendarConfig) {
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
    expect(element.isolateScope().display).toBe('week');
  });

  it('should bind the data value into its scope', function () {
    expect(element.isolateScope().data).toBe(scope.myData);
  });

  it('should attach an eventSources object to its scope', function () {
    expect(angular.isArray(element.isolateScope().eventSources)).toBe(true);
  });

  it('should attach an options object to its scope', function () {
    expect(element.isolateScope().options).toBeDefined();
  });

  it('should tell the calendar to rebuild when display setting changes in the parent scope', function () {
    spyOn(element.isolateScope().cal, 'fullCalendar');
    scope.$apply(function () {
      scope.mode = 'week';
    });
    // first time won't do it, we have to call a second time
    scope.$apply(function () {
      scope.mode = 'month';
    });
    expect(element.isolateScope().cal.fullCalendar).toHaveBeenCalledWith('destroy');
    expect(element.isolateScope().cal.fullCalendar).toHaveBeenCalledWith(element.isolateScope().options);
  });

  it('should emit a setDateRange event when the calendar loads up a date range', function () {
    var handler = jasmine.createSpy('eventHandler'),
      viewMock = {
        start: moment(),
        end: moment()
      };
    scope.$on('setDateRange', handler);
    element.isolateScope().options.viewRender(viewMock, element);
    expect(handler).toHaveBeenCalled();
    expect(handler.calls.mostRecent().args[1]).toBe(viewMock.start);
    expect(handler.calls.mostRecent().args[2]).toBe(viewMock.end);
  });

  describe('viewRender()', function () {
    it('should turn escaped HTML entities into actual elements', function () {
      var viewMock = {
        start: moment(),
        end: moment()
      },
      scope = element.isolateScope();
      element = angular.element('<div><table><th class="fc-day-header">&lt;b&gt;Title1&lt;/b&gt;</th><th class="fc-day-header">&lt;i&gt;Title2&lt;/i&gt;</th></table></div>');
      scope.options.viewRender(viewMock, element);

      expect(element.find('th').first().html()).toEqual('<b>Title1</b>');
      expect(element.find('th').last().html()).toEqual('<i>Title2</i>');
    });
  });

  describe('dayRender()', function () {

    it('should mark closed day as closed', function () {
      var ele = angular.element('<td class="fc-day"><div><div class="fc-day-number">29</div><div class="fc-day-content"><div>&nbsp;</div></div></div></td>');
      element.scope().openDates = {
        '1990-01-01': true,
        '1990-01-02': true
      };
      element.isolateScope().options.dayRender(moment().toDate(), ele);
      expect(ele.hasClass('closed')).toBeTruthy();
    });

    it('should mark open day as not closed', function () {
      var ele = angular.element('<td class="fc-day closed"><div><div class="fc-day-number">29</div><div class="fc-day-content"><div>&nbsp;</div></div></div></td>');
      element.isolateScope().openDates = {
        '1990-01-01': true,
        '1990-01-02': true
      };
      element.isolateScope().options.dayRender(moment('1990-01-01', 'YYYY-MM-DD').toDate(), ele);
      expect(ele.hasClass('closed')).toBeFalsy();
    });

    it('should recognize date string', function () {
      var ele = angular.element('<td class="fc-day closed"><div><div class="fc-day-number">29</div><div class="fc-day-content"><div>&nbsp;</div></div></div></td>');
      element.isolateScope().openDates = {
        '1990-01-01': true,
        '1990-01-02': true
      };
      element.isolateScope().options.dayRender('1990-01-01', ele);
      expect(ele.hasClass('closed')).toBeFalsy();
    });

    it('should add has-events class if day has events', function () {
      var ele = angular.element('<td class="fc-day closed"><div><div class="fc-day-content"><div>&nbsp;</div></div></div></td>');
      element.isolateScope().openDates = {
        '1990-01-10': true
      };
      element.isolateScope().eventsByDate = {
        '1990-01-10': ['Event 1', 'Event 2']
      };
      element.isolateScope().options.dayRender('1990-01-10', ele);
      expect(ele.hasClass('has-events')).toBeTruthy();
    });

    it('should remove has-events class if day has no events', function () {
      var ele = angular.element('<td class="fc-day closed"><div><div class="fc-day-content"><div>&nbsp;</div></div></div></td>');
      element.isolateScope().openDates = {
        '1990-01-10': true
      };
      element.isolateScope().eventsByDate = {
        '1990-01-10': []
      };
      element.isolateScope().options.dayRender('1990-01-10', ele);
      expect(ele.hasClass('has-events')).toBeFalsy();
    });

  });


  describe('eventRender()', function () {
    it('should turn escaped HTML entities into actual elements', function () {
      var eventMock = {
        start: moment(),
        subTitle: 'event subtitle'
      },
      scope = element.isolateScope();
      element = angular.element('<div><table><span class="fc-title">&lt;b&gt;Title1&lt;/b&gt;</span><span class="fc-title">&lt;i&gt;Title2&lt;/i&gt;</span><span class="fc-content"></span></table></div>');
      scope.options.eventRender(eventMock, element);

      expect(element.find('span.fc-title').first().html()).toEqual('<b>Title1</b>');
      expect(element.find('span.fc-title').last().html()).toEqual('<i>Title2</i>');
    });

    it('should add class for events today', function () {
      var eventMock = {
        start: moment(),
        subTitle: 'event subtitle'
      },
      scope = element.isolateScope();
      element = angular.element('<div><table><span class="fc-title">&lt;b&gt;Title1&lt;/b&gt;</span><span class="fc-title">&lt;i&gt;Title2&lt;/i&gt;</span><span class="fc-content"></span></table></div>');
      scope.options.eventRender(eventMock, element);

      expect(element.hasClass('today')).toBeTruthy();
      expect(element.hasClass('overdue')).toBeFalsy();
    });

    it('should add class for events overdue', function () {
      var eventMock = {
        start: moment().subtract('days', 1),
        subTitle: 'event subtitle'
      },
      scope = element.isolateScope();
      element = angular.element('<div><table><span class="fc-title">&lt;b&gt;Title1&lt;/b&gt;</span><span class="fc-title">&lt;i&gt;Title2&lt;/i&gt;</span><span class="fc-content"></span></table></div>');
      scope.options.eventRender(eventMock, element);

      expect(element.hasClass('overdue')).toBeTruthy();
      expect(element.hasClass('today')).toBeFalsy();
    });
  });

  describe('scope.watch(data)', function () {
    it('should watch scope.data and update when data is not null', function () {
      element.isolateScope().data.openDates = 'string';
      element.isolateScope().$apply();

      expect(element.isolateScope().openDates).toEqual('string');
    });

    it('should watch scope.data and not update when data is null', function () {
      element.isolateScope().data = null;
      element.isolateScope().$apply();

      expect(element.isolateScope().openDates).toEqual({});
    });

    it('should render each fc-day cell', function () {
      element.append('<div class="fc-day"></div><div class="fc-day"></div><div class="fc-day"></div>');

      element.isolateScope().data.openDates = 'string';

      spyOn(element.isolateScope().options, 'dayRender');
      element.isolateScope().$apply();

      expect(element.isolateScope().options.dayRender.calls.count()).toEqual(3);
    });
  });
});
