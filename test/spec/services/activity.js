'use strict';

describe('Service: activity', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var activity;
  beforeEach(inject(function (_activity_) {
    activity = _activity_;
  }));

  it('should start with no indicators', function () {
    expect(activity.indicators.arePresent()).toBe(false);
  });

  it('should add an indicator for new activities by default', function () {
    activity.add('foo');
    expect(activity.indicators.arePresent()).toBe(true);
    activity.remove('foo');
  });

  it('should remove the indicator when the activity is removed', function () {
    activity.add('foo');
    activity.remove('foo');
    expect(activity.indicators.arePresent()).toBe(false);
  });

  it('should correctly track indicators as multiple activities are added and removed in arbitrary order', function () {
    activity.add('foo');
    activity.add('bar');
    expect(activity.indicators.arePresent()).toBe(true);
    activity.remove('foo');
    expect(activity.indicators.arePresent()).toBe(true);
    activity.add('baz');
    activity.remove('bar');
    expect(activity.indicators.arePresent()).toBe(true);
    activity.remove('baz');
    expect(activity.indicators.arePresent()).toBe(false);
  });

  it('should allow new indicators to be suppressed individually', function () {
    activity.add('foo', false);
    expect(activity.indicators.arePresent()).toBe(false);
    activity.remove('foo');
  });

  it('should allow new indicators to be suppressed globally', function () {
    activity.indicators.off();
    activity.add('foo');
    activity.add('bar');
    expect(activity.indicators.arePresent()).toBe(false);
    activity.remove('foo');
    activity.remove('bar');
    activity.indicators.on();
    expect(activity.indicators.arePresent()).toBe(false);
  });

  it('should correctly track indicators as activities are added with and without them in arbitrary order', function () {
    activity.add('noIndicatorDirect', false);
    activity.add('indicator1');

    activity.indicators.off();
    activity.add('noIndicatorGlobal');
    expect(activity.indicators.arePresent()).toBe(true);
    activity.indicators.on();

    activity.add('indicator2');
    expect(activity.indicators.arePresent()).toBe(true);

    activity.remove('indicator2');
    expect(activity.indicators.arePresent()).toBe(true);

    activity.remove('indicator1');
    expect(activity.indicators.arePresent()).toBe(false);

    activity.remove('noIndicatorDirect');
    expect(activity.indicators.arePresent()).toBe(false);

    activity.add('newIndicator');
    expect(activity.indicators.arePresent()).toBe(true);

    activity.remove('newIndicator');
    expect(activity.indicators.arePresent()).toBe(false);

    activity.remove('noIndicatorGlobal');
    expect(activity.indicators.arePresent()).toBe(false);

    activity.add('newIndicator');
    expect(activity.indicators.arePresent()).toBe(true);

    activity.remove('newIndicator');
    expect(activity.indicators.arePresent()).toBe(false);
  });

  it('should allow activity ids to be reused independently after removal', function () {
    activity.add('foo');
    activity.remove('foo');

    activity.add('foo', false);
    expect(activity.indicators.arePresent()).toBe(false);
    activity.remove('foo');

    activity.add('foo');
    expect(activity.indicators.arePresent()).toBe(true);
    activity.remove('foo');
    expect(activity.indicators.arePresent()).toBe(false);
  });

  it('should replace the activity and update indicators to match if an existing id is used', function () {
    activity.add('foo');
    activity.add('foo', false);
    expect(activity.indicators.arePresent()).toBe(false);

    activity.add('foo');
    expect(activity.indicators.arePresent()).toBe(true);

    activity.remove('foo');
    expect(activity.indicators.arePresent()).toBe(false);

    activity.add('foo');
    activity.add('foo');
    expect(activity.indicators.arePresent()).toBe(true);
    activity.remove('foo');
    expect(activity.indicators.arePresent()).toBe(false);
  });

});
